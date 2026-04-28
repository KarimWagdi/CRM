import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from '../entities/activity.entity';
import { CreateActivityDto, UpdateActivityDto } from '../dto/activity.dto';
import { Contact } from '../entities/contact.entity';
import { Opportunity } from '../entities/opportunity.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(Opportunity)
    private opportunityRepository: Repository<Opportunity>,
  ) {}

  findAll(): Promise<Activity[]> {
    return this.activityRepository.find({ relations: ['contact', 'opportunity'] });
  }

  async findOne(id: number): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id },
      relations: ['contact', 'opportunity'],
    });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    return activity;
  }

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const { contactId, opportunityId, ...activityData } = createActivityDto;
    const activity = this.activityRepository.create(activityData);

    if (contactId) {
      const contact = await this.contactRepository.findOneBy({ id: contactId });
      if (!contact) {
        throw new NotFoundException(`Contact with ID ${contactId} not found`);
      }
      activity.contact = contact;
    }

    if (opportunityId) {
      const opportunity = await this.opportunityRepository.findOneBy({ id: opportunityId });
      if (!opportunity) {
        throw new NotFoundException(`Opportunity with ID ${opportunityId} not found`);
      }
      activity.opportunity = opportunity;
    }

    return this.activityRepository.save(activity);
  }

  async update(id: number, updateActivityDto: UpdateActivityDto): Promise<Activity> {
    const activity = await this.findOne(id);
    const { contactId, opportunityId, ...activityData } = updateActivityDto;

    if (contactId !== undefined) {
      if (contactId === null) {
        activity.contact = null as any;
      } else {
        const contact = await this.contactRepository.findOneBy({ id: contactId });
        if (!contact) {
          throw new NotFoundException(`Contact with ID ${contactId} not found`);
        }
        activity.contact = contact;
      }
    }

    if (opportunityId !== undefined) {
      if (opportunityId === null) {
        activity.opportunity = null as any;
      } else {
        const opportunity = await this.opportunityRepository.findOneBy({ id: opportunityId });
        if (!opportunity) {
          throw new NotFoundException(`Opportunity with ID ${opportunityId} not found`);
        }
        activity.opportunity = opportunity;
      }
    }

    this.activityRepository.merge(activity, activityData);
    return this.activityRepository.save(activity);
  }

  async remove(id: number): Promise<void> {
    const result = await this.activityRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
  }
}
