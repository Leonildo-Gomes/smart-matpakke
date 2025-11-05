/*
  Warnings:

  - You are about to drop the column `user_id` on the `recipe_feedbacks` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_birth` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `family_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `photo_url` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `user_preferences` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[weekly_plan_id,day_of_week,family_member_id]` on the table `daily_plans` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `family_member_id` to the `daily_plans` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `families` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `family_member_id` to the `recipe_feedbacks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('1', '0');

-- DropForeignKey
ALTER TABLE "public"."recipe_feedbacks" DROP CONSTRAINT "recipe_feedbacks_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_preferences" DROP CONSTRAINT "user_preferences_preference_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_preferences" DROP CONSTRAINT "user_preferences_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_family_id_fkey";

-- AlterTable
ALTER TABLE "daily_plans" ADD COLUMN     "family_member_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "families" ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "recipe_feedbacks" DROP COLUMN "user_id",
ADD COLUMN     "family_member_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "date_of_birth",
DROP COLUMN "family_id",
DROP COLUMN "gender",
DROP COLUMN "name",
DROP COLUMN "photo_url";

-- DropTable
DROP TABLE "public"."user_preferences";

-- CreateTable
CREATE TABLE "family_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "gender" "Gender",
    "photo_url" TEXT,
    "status" "Status" NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "family_id" TEXT NOT NULL,
    "account_id" TEXT,

    CONSTRAINT "family_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_member_preferences" (
    "family_member_id" TEXT NOT NULL,
    "preference_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "family_members_account_id_key" ON "family_members"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "family_member_preferences_family_member_id_preference_id_key" ON "family_member_preferences"("family_member_id", "preference_id");

-- CreateIndex
CREATE UNIQUE INDEX "daily_plans_weekly_plan_id_day_of_week_family_member_id_key" ON "daily_plans"("weekly_plan_id", "day_of_week", "family_member_id");

-- AddForeignKey
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_member_preferences" ADD CONSTRAINT "family_member_preferences_family_member_id_fkey" FOREIGN KEY ("family_member_id") REFERENCES "family_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_member_preferences" ADD CONSTRAINT "family_member_preferences_preference_id_fkey" FOREIGN KEY ("preference_id") REFERENCES "preferences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_feedbacks" ADD CONSTRAINT "recipe_feedbacks_family_member_id_fkey" FOREIGN KEY ("family_member_id") REFERENCES "family_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_plans" ADD CONSTRAINT "daily_plans_family_member_id_fkey" FOREIGN KEY ("family_member_id") REFERENCES "family_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
