import type { Metadata } from "next";
import SurveyForm from "@/components/survey/SurveyForm";
import { SATISFACTION_SURVEY } from "@/data/satisfactionSurvey";

export const metadata: Metadata = { title: SATISFACTION_SURVEY.title };

export default function SatisfactionSurveyPage() {
  return <SurveyForm />;
}
