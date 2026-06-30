/*
  Warnings:

  - You are about to drop the column `created_at` on the `completed_tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "completed_tasks" DROP COLUMN "created_at",
ADD COLUMN     "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
