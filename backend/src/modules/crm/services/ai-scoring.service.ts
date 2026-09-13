import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, LeadStatus } from '../entities/lead.entity';

export interface AiLeadScoreResult {
  leadId: number;
  leadName: string;
  score: number; // 0 to 100
  conversionProbability: number; // 0 to 1
  grade: 'A' | 'B' | 'C' | 'D';
  insights: string[];
}

@Injectable()
export class AiScoringService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  async scoreLead(leadId: number): Promise<AiLeadScoreResult> {
    const lead = await this.leadRepository.findOneBy({ id: leadId });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${leadId} not found`);
    }

    let score = 30; // Base score
    const insights: string[] = [];

    // 1. Contact Information Completeness
    if (lead.email) {
      score += 15;
      insights.push('Email address is verified.');
    }
    if (lead.company) {
      score += 20;
      insights.push(`Associated with enterprise entity "${lead.company}".`);
    } else {
      insights.push('No company specified; individual lead profile.');
    }

    // 2. Status Weighting
    switch (lead.status) {
      case LeadStatus.QUALIFIED:
        score += 30;
        insights.push('Lead has met qualification criteria.');
        break;
      case LeadStatus.CONTACTED:
        score += 15;
        insights.push('Initial outreach established.');
        break;
      case LeadStatus.NEW:
        score += 5;
        insights.push('Fresh lead awaiting engagement.');
        break;
      case LeadStatus.LOST:
        score = 5;
        insights.push('Lead marked as lost; low conversion likelihood.');
        break;
    }

    // 3. Source Weighting
    if (lead.source) {
      const sourceLower = lead.source.toLowerCase();
      if (sourceLower.includes('referral') || sourceLower.includes('partner')) {
        score += 15;
        insights.push('High-intent channel source (Referral/Partner).');
      } else if (sourceLower.includes('website') || sourceLower.includes('inbound')) {
        score += 10;
        insights.push('Inbound web source detected.');
      } else {
        score += 5;
      }
    }

    // Bound score between 0 and 100
    score = Math.min(100, Math.max(0, score));
    const conversionProbability = parseFloat((score / 100).toFixed(2));

    let grade: 'A' | 'B' | 'C' | 'D';
    if (score >= 80) grade = 'A';
    else if (score >= 60) grade = 'B';
    else if (score >= 40) grade = 'C';
    else grade = 'D';

    return {
      leadId: lead.id,
      leadName: `${lead.firstName} ${lead.lastName}`,
      score,
      conversionProbability,
      grade,
      insights,
    };
  }

  async batchScoreLeads(): Promise<AiLeadScoreResult[]> {
    const leads = await this.leadRepository.find();
    const results = await Promise.all(
      leads.map((lead) => this.scoreLead(lead.id)),
    );
    return results.sort((a, b) => b.score - a.score);
  }
}
