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
import { AccountController } from './controllers/account.controller';
import { ContactController } from './controllers/contact.controller';
import { LeadController } from './controllers/lead.controller';
import { OpportunityController } from './controllers/opportunity.controller';
import { ActivityController } from './controllers/activity.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Contact, Lead, Opportunity, Activity]),
  ],
  controllers: [
    AccountController,
    ContactController,
    LeadController,
    OpportunityController,
    ActivityController,
  ],
  providers: [
    AccountService,
    ContactService,
    LeadService,
    OpportunityService,
    ActivityService,
  ],
})
export class CrmModule {}
