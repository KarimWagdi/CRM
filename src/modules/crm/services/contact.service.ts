import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { CreateContactDto, UpdateContactDto } from '../dto/contact.dto';
import { Account } from '../entities/account.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  findAll(): Promise<Contact[]> {
    return this.contactRepository.find({ relations: ['account'] });
  }

  async findOne(id: number): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id },
      relations: ['account'],
    });
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const { accountId, ...contactData } = createContactDto;
    const account = await this.accountRepository.findOneBy({ id: accountId });
    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }
    const contact = this.contactRepository.create({
      ...contactData,
      account,
    });
    return this.contactRepository.save(contact);
  }

  async update(id: number, updateContactDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.findOne(id);
    const { accountId, ...contactData } = updateContactDto;

    if (accountId) {
      const account = await this.accountRepository.findOneBy({ id: accountId });
      if (!account) {
        throw new NotFoundException(`Account with ID ${accountId} not found`);
      }
      contact.account = account;
    }

    this.contactRepository.merge(contact, contactData);
    return this.contactRepository.save(contact);
  }

  async remove(id: number): Promise<void> {
    const result = await this.contactRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
  }
}
