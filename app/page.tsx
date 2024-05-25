import { TypographyH2, TypographyP } from "@/components/ui/typography";

export default function Home() {
  //TODO: redo home
  return (
    <>
      <TypographyH2>Welcome to the Harvard Square Homeless Shelter Lottery Management Website!</TypographyH2>
      <TypographyP>
        If it is impossible to log-in (even though you have double checked that you are on the sign-up whitelist), it may be the case that Supabase needs to be re-started. Please check the documentation for details on how to restart Supabase (no need to be intimidated, this is just involves one press of a button!)
      </TypographyP>
    </>
  );
}
