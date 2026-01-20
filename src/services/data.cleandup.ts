import cron from 'node-cron';
import { prisma } from '../lib/prisma';

export function startTokenCleanupJob() {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    const result = await prisma.token.deleteMany({
      where: {
        expiresAt: {
          lt: new Date() // Delete all tokens with expiresAt < now
        }
      }
    });
    console.log(`Deleted ${result.count} expired tokens`);
  });
}
