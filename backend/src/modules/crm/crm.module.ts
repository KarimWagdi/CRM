import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Contact } from './entities/contact.entity';
import { Lead } from './entities/lead.entity';
import { Opportunity } from './entities/opportunity.entity';
import { Activity } from './entities/activity.entity';
import { AccountService } from './services/account.service';
import { ContactService } from './services/contact.service';
import { LeadService } from './services/lead.service';
import { OpportunityService } from './services/opportunity.service';
import { ActivityService } from './services/activity.service';
import { AiScoringService } from './services/ai-scoring.service';
import { AccountController } from './controllers/account.controller';
import { ContactController } from './controllers/contact.controller';
import { LeadController } from './controllers/lead.controller';
import { OpportunityController } from './controllers/opportunity.controller';
import { ActivityController } from './controllers/activity.controller';
import { AiScoringController } from './controllers/ai-scoring.controller';
import { AccountingModule } from '../accounting/accounting.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Contact, Lead, Opportunity, Activity]),
    AccountingModule,
  ],
  controllers: [
    AccountController,
    ContactController,
    LeadController,
    OpportunityController,
    ActivityController,
    AiScoringController,
  ],
  providers: [
    AccountService,
    ContactService,
    LeadService,
    OpportunityService,
    ActivityService,
    AiScoringService,
  ],
  exports: [LeadService, OpportunityService, AiScoringService],
})
export class CrmModule {}
