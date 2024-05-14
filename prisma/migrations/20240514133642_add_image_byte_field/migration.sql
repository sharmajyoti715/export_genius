/*
  Warnings:

  - Added the required column `image` to the `UserImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userimage` ADD COLUMN `image` LONGBLOB NOT NULL;
