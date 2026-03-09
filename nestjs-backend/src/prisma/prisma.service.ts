import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit {
  public client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  async onModuleInit() {
    try {
      await this.client.$connect();
      console.log('[Prisma] Connected successfully');
    } catch (e: any) {
      console.warn('[Prisma] Eager connection failed:', e.message);
    }
  }
}
