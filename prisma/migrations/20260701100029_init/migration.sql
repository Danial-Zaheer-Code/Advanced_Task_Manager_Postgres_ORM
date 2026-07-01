/*
  Warnings:

  - You are about to drop the column `isOnRepeat` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "isOnRepeat",
ADD COLUMN     "due_date" TIMESTAMP(3);
