/*
  Warnings:

  - A unique constraint covering the columns `[stripe_account]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripe_account` to the `admins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "stripe_account" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "admins_stripe_account_key" ON "admins"("stripe_account");
