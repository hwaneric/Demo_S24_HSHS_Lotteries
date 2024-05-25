import { TypographyH2, TypographyH3, TypographyH4, TypographyList, TypographyMuted } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";

export default async function SyncPage() {
  // Create supabase server component client and obtain user session from Supabase Auth
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  return (
    <>
      <TypographyH2>Intructions to Sync with New Google Form</TypographyH2>
      <TypographyH3>Option 1: Creating a New Google Form</TypographyH3>
      <TypographyMuted>NOTE: This may be done without creating a new Google Sheets Database</TypographyMuted>
      <TypographyH4>Step 1: Duplicate Last Season`s Form</TypographyH4>
      <TypographyList
        items={[
          "Open last season's form.",
          "Click the three dots in the top right corner and select “Make a copy”. Follow the instructions for creating the copy (this should also copy the App Scripts code which links the form to the website).",
          "Then in the new form, click the 3 dots in the top right corner. In the resulting menu, click on the 'Script Editor' option. (NOTE: you may be unable to sign into App Scripts if you are currently logged into multiple Google accounts. If you encounter this issue, log out of your other Google accounts or use Incognito Window).",
          "Once you open the script editor, on the left hand side, go to the Settings option and scroll down. You should see something called 'Script Properties.' Click 'Edit script properties.' You need to add 2 script properties. The first script property will have Property 'base_url' and Value 'https://s24-hshs-lotteries.vercel.app/' (Make sure to not include quotation marks. To check if you did it right, you can go to the old form's script properties. The new script property you just created should be IDENTICAL to the 'base_url' Script Property from the old form).",
          "The second script property you should add to the new form should have Property 'form_id' and Value equal to the ID of the new form. To get the ID of the new form, simply go to the new form (NOTE, GO BACK TO THE FORM ITSELF. YOU SHOULD NOT BE LOOKING AT THE SCRIPT EDITOR!). The URL of the form should look something like 'https://docs.google.com/forms/d/1vFjIvBw6G2f27b14JTjobbwSNOIeTTiJd7i0mgHNQ3g/edit'. The random-looking string of numbers and letters in the middle of the URL is the form id (e.g. in the example the id is '1vFjIvBw6G2f27b14JTjobbwSNOIeTTiJd7i0mgHNQ3g'). Use this form ID as the value in the form_id script property (remember to not have any quotation marks!).",
          "Remember to click 'Save script properties' if you haven't done so already!",
          "Go the left hand side, and open the 'editor' window (should be the button with the < >). This is the script editor. At the top of the new form's script editor, you should see several buttons, among which include 'Run', 'Debug', and a dropdown that should default to 'main'. From the dropdown, select the 'setUpTrigger' option and click the 'Run' button. If the execution log completes without any error messages, you are done! You may see pop-up saying you need to get additional permssisions to run the script. More on that below.",
          "If you are told that you need additional permissions, follow the instructions. You will eventually arrive at a screen where there is a small 'Advanced' option in small text at the bottom of the screen. Click 'Advanced.' Then, you will arrive at a screen telling you proceeding may be unsafe. Rest assured, everything is fine. This screen is appearing because we did not verify this email/project with Google to tell them that this a legitimate project, so they are being naturally suspicious. Click the Go to Project (Unsafe) option (the exact wording may be a little different) (we promise this is safe!). Approve the permissions that the pop-up requests. Then you should be done! ",
          "One OPTIONAL step is to go back to the old form's script editor, and click into the 'Triggers' option on the left side menu. Then click the 3 dots on the right side of each row and delete each trigger. This will ensure that new responses to the old form are not added to the database moving forward. NOTE: you are only able to delete triggers that you yourself set up (aka clicked the 'Run' button for the 'setUpTrigger' function mentioned above)."
        ]}
      ></TypographyList>
      <TypographyH4>Step 2: Make Changes to the New Form</TypographyH4>
      <TypographyList
        items={[
          "You may change the wording on any questions freely (please keep the options for gender the same).",
          "You may add new questions or rearrange questions, however this will require making changes to the App Script file. To do so, click the three dots in the top right corner and select “Script editor”. From here, find the block of code that says “REFLECT EDITS HERE”. If you add in any questions, you must add a string identifier (in single quotes, followed by a comma, no caps, no spaces, no special characters) for this question in its proper ordered location in this list.",
          "IMPORTANT: If you rearrange the questions in the form, you must rearrange the string identifiers in this list so that the order in the form and the order in the list are the same.",
        ]}
      ></TypographyList>
      <TypographyMuted>
        NOTE: Any added questions will not be reflected in the Google Sheets Database or the website - this requires
        changing the code of the website.
      </TypographyMuted>

      <TypographyH3>Option 2: Synching Up with an Existing Google Form</TypographyH3>
      <TypographyMuted>NOTE: This may be done without creating a new Google Sheets Database</TypographyMuted>
      <TypographyH4>Step 1: Copy Over App Scripts</TypographyH4>
      <TypographyList
        items={[
          "In the previous season's Google Form, click the 3 dots in the top right corner. In the resulting menu, click on the 'Script Editor' Option. (NOTE: you may be unable to sign into App Scripts if you are currently logged into multiple Google accounts. If you encounter this issue, log out of your other Google accounts or use Incognito Window).",
          "In the page that opens, copy all the code in the code editor. Then, in the NEW form, click the 3 dots again and go to the new form's Script Editor. In the new form's script editor, delete anything that is already in the editor. Once the editor is blank, paste the code from the old form's script editor, then click the save button (the little floppy disk) at the top of the script editor.",
          "Once you open the script editor, on the left hand side, go to the Settings option and scroll down. You should see something called 'Script Properties.' Click 'Edit script properties.' You need to add 2 script properties. The first script property will have Property 'base_url' and Value 'https://s24-hshs-lotteries.vercel.app/' (Make sure to not include quotation marks. To check if you did it right, you can go to the old form's script properties. The new script property you just created should be IDENTICAL to the 'base_url' Script Property from the old form).",
          // "Go back to the old form's Script Editor. On the left hand side, go to the Settings option and scroll down. You should see something called 'Script Properties.' In the new form's Script Editor, go to the Script Properties in Settings and then click 'Edit script properties.' You need to add 2 script properties. The first script property will have Property 'base_url' and Value 'https://s24-hshs-lotteries.vercel.app/' (Make sure to not include quotation marks. This should be IDENTICAL to the 'base_url' Script Property from the old form).",
          "The second script property you should add to the new form should have Property 'form_id' and Value equal to the ID of the new form. To get the ID of the new form, simply go to the new form (NOTE, GO BACK TO THE FORM ITSELF. YOU SHOULD NOT BE LOOKING AT THE SCRIPT EDITOR!). The URL of the form should look something like 'https://docs.google.com/forms/d/1vFjIvBw6G2f27b14JTjobbwSNOIeTTiJd7i0mgHNQ3g/edit'. The random-looking string of numbers and letters in the middle of the URL is the form id (e.g. in the example the id is '1vFjIvBw6G2f27b14JTjobbwSNOIeTTiJd7i0mgHNQ3g'). Use this form ID as the value in the form_id script property (remember to not have any quotation marks!).",
          "Remember to click 'Save script properties' if you haven't done so already!",
          "Go the left hand side, and open the 'editor' window (should be the button with the < >). This is the script editor. At the top of the new form's script editor, you should see several buttons, among which include 'Run', 'Debug', and a dropdown that should default to 'main'. From the dropdown, select the 'setUpTrigger' option and click the 'Run' button. If the execution log completes without any error messages, you are done! You may see pop-up saying you need to get additional permssisions to run the script. More on that below.",
          "If you are told that you need additional permissions, follow the instructions. You will eventually arrive at a screen where there is a small 'Advanced' option in small text at the bottom of the screen. Click 'Advanced.' Then, you will arrive at a screen telling you proceeding may be unsafe. Rest assured, everything is fine. This screen is appearing because we did not verify this email/project with Google to tell them that this a legitimate project, so they are being naturally suspicious. Click the Go to Project (Unsafe) option (the exact wording may be a little different) (we promise this is safe!). Approve the permissions that the pop-up requests. Then you should be done! ",
          "One OPTIONAL step is to go back to the old form's script editor, and click into the 'Triggers' option on the left side menu. Then click the 3 dots on the right side of each row and delete each trigger. This will ensure that new responses to the old form are not added to the database moving forward. NOTE: you are only able to delete triggers that you yourself set up (aka clicked the 'Run' button for the 'setUpTrigger' function mentioned above)."
        ]}
      ></TypographyList>
      <TypographyH4>Step 2: Handle Changes to the Form</TypographyH4>
      <TypographyList
        items={[
          "You may change the wording on any questions freely (please keep the options for gender the same).",
          "You may add new questions or rearrange questions, however this will require making changes to the App Script file. To do so, click the three dots in the top right corner and select “Script editor”. From here, find the block of code that says “REFLECT EDITS HERE”. If you add in any questions, you must add a string identifier (in single quotes, followed by a comma, no caps, no spaces, no special characters) for this question in its proper ordered location in this list.",
          "IMPORTANT: If you rearrange the questions in the form, you must rearrange the string identifiers in this list so that the order in the form and the order in the list are the same.",
        ]}
      ></TypographyList>

      {/* <TypographyMuted>NOTE: This assumes that the existing Google Form that will be used </TypographyMuted> */}


      <TypographyH3>Switching to a New Google Sheet Database</TypographyH3>
      <TypographyMuted>NOTE: This may be done without creating a new Google Form</TypographyMuted>
      <TypographyMuted>NOTE: For clarification, each Google Sheet document is made up of sheets. We will henceforth call the sheets INSIDE a Google Sheet document a subsheet for clarity. We are duplicate </TypographyMuted>
      <TypographyH4>Step 1: Duplicate Last Season`s Subsheet</TypographyH4>
      <TypographyList
        items={[
          "Open the Google Sheet Database",
          "At the bottom of the page, locate the subsheet named “current_season”. Click the arrow on this subsheet and create a duplicate.",
          "Rename this new copy to whatever you would like – this will be the preserved copy from the previous season.",
          "Go back to the “current_season” subsheet and delete all rows 2 and beyond (preserve the header row) – this will be the database for the new season. Note that there are many columns that may stretch out to the right out of view from the screen, and make sure you delete all of those columns as well! You're now done!",
          "IMPORTANT: It is critical that the subsheet for the current season is always named “current_season”. Otherwise, the form responses will be sent to the wrong location or not sent at all.",
          "To be crystal clear, once this process is done, you should be using a new subsheet for the upcoming season, but you should still be using the same Google Sheet document. We highly recommend that you do not switching to an altogether new Google Sheet document. If you would like to create a new Google Sheet document because the current one is getting too complicated, we would highly recommend creating a duplicate of the current sheet for historical record and deleting extraneous subsheets from the original Google Sheet document to simplify (REMEMBER TO NEVER DELETE THE 'current_season' SUBSHEET!). If migrating to a new Google Sheet is absolutely necessary, please contact Tech for Social Good and ask to speak with Eric Hwang, Class of 2025 (for any technical folks reading this, you'll have to re-share the Service Account onto the new Google Sheet document and update the sheet_id env variable on Vercel)."
        ]}
      ></TypographyList>
    </>
  );
}
