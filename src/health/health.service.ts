import { Injectable, Logger } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import os from 'os';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private readonly logger: Logger,
    private readonly disk: DiskHealthIndicator,
  ) {}

  async check() {
    const memorySizeInMB = 150;
    this.logger.log(`Checking health`, HealthService.name);
    const healthInfo = await this.health.check([
      () => this.http.pingCheck('nestjs_docs', 'https://docs.nestjs.com'),
      () => this.http.pingCheck('example_website', 'https://example.com'),
      () => this.memory.checkHeap('memory_heap', memorySizeInMB * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', memorySizeInMB * 1024 * 1024),
    ]);
    return {
      status: healthInfo.status,
      healthInfo,
      os: {
        hostname: os.hostname(),
        platform: os.platform(),
        release: os.release(),
        uptime: os.uptime(),
        loadavg: os.loadavg(),
        totalmemInMB: os.totalmem() / 1024 / 1024,
        freememInMB: os.freemem() / 1024 / 1024,
        cpus: os.cpus(),
      },
    };
  }
}
