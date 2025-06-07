import { Html } from "@react-email/html";
import { Head } from "@react-email/head";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Container } from "@react-email/container";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Button } from "@react-email/button";

type WelcomeEmailProps = {
  userName: string;
  actionUrl: string;
};

export default function WelcomeEmail({
  userName = "משתמש יקר",
  actionUrl = "https://your-website.com",
}: WelcomeEmailProps) {
  return (
    <Html lang='he'>
      <Head />
      <Preview>ברוך הבא ל-Share Food! אנחנו שמחים שהצטרפת :)</Preview>
      <Section style={main}>
        <Container style={container}>
          <Heading style={heading}>שלום {userName},</Heading>

          <Text style={text}>
            תודה שהצטרפת לקהילת <strong>Share Food</strong>!
          </Text>

          <Text style={text}>
            אם יש לך שאלות או זקוק לעזרה, אל תהסס לפנות אלינו.
          </Text>

          <Button style={button} href={actionUrl}>
            כניסה לאתר
          </Button>

          <Text style={text}>בהצלחה!</Text>

          <Text style={footer}>בברכה,</Text>
          <Text style={footer}>ידידיה אברג&apos;ל - מייסד</Text>
        </Container>
      </Section>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f9f9f9",
  padding: "24px 0",
  direction: "rtl" as const,
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "24px",
  maxWidth: "600px",
  margin: "0 auto",
  fontFamily: "Arial, sans-serif",
  color: "#333333",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  textAlign: "right" as const,
};

const heading = {
  fontSize: "20px",
  color: "#2c3e50",
  marginBottom: "16px",
};

const text = {
  fontSize: "14px",
  lineHeight: "1.6",
  marginBottom: "12px",
};

const footer = {
  fontSize: "12px",
  marginBottom: "4px",
};

const button = {
  display: "inline-block",
  // Black background color for the button
  backgroundColor: "#2c3e50",
  color: "#ffffff",
  fontSize: "14px",
  padding: "12px 24px",
  borderRadius: "8px",
  textDecoration: "none",
  margin: "16px 0",
};
