import { promises as fs } from 'fs';
import path from 'path';

export async function cleanupFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
    console.log(`[Cleanup] Deleted: ${filePath}`);
  } catch (error) {
    console.error(`[Cleanup] Error deleting ${filePath}:`, error);
  }
}

export async function ensureTmpDir(): Promise<string> {
  const tmpDir = path.join(process.cwd(), 'tmp');
  try {
    await fs.access(tmpDir);
  } catch {
    await fs.mkdir(tmpDir, { recursive: true });
  }
  return tmpDir;
}
