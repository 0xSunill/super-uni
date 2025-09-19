/*
  Warnings:

  - A unique constraint covering the columns `[teacherId]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Wallet_teacherId_key" ON "public"."Wallet"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_studentId_key" ON "public"."Wallet"("studentId");
