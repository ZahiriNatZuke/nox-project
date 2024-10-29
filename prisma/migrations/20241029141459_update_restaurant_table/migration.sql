/*
  Warnings:

  - Added the required column `maxCapacity` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "maxCapacity" INTEGER NOT NULL,
ADD COLUMN     "onlyAdults" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "capacity" SET DEFAULT 0;
