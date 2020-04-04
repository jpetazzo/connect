import React from "react";
import { Columns, Container, Section, Content } from "react-bulma-components";
import Icons from "../atoms/MediaIcons";
import "./Footer.scss";

const links = [
  { name: "Contact", url: "https://www.redi-school.org/imprint" },
  { name: "FAQ", url: "/" },
  {
    name: "Transparency",
    url: "https://www.redi-school.org/berlin-transparency/",
  },
  { name: "Cookie policy", url: "/" },
  {
    name: "Data privacy policy",
    url: "https://www.redi-school.org/data-privacy-policy/",
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Section>
          <Columns>
            <Columns.Column responsive={{ mobile: { hide: { value: true } } }}>
              <p>
                <a href="https://www.redi-school.org/">ReDI School Website</a>
              </p>
              <p>&copy; {year} By ReDI School</p>
            </Columns.Column>
            <Columns.Column
              size={4}
              responsive={{ tablet: { hide: { value: true } } }}
            >
              <p className="is-size-5">Follow us</p>
              <Icons />
            </Columns.Column>
            <Columns.Column size={6}>
              {links.map((link) => (
                <Content key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </Content>
              ))}
            </Columns.Column>
            <Columns.Column
              mobile={{
                size: "is-narrow",
              }}
              responsive={{ mobile: { hide: { value: true } } }}
            >
              <p>Follow us</p>
              <Icons />
            </Columns.Column>
            <Columns.Column
              mobile={{
                size: "four-fifths",
              }}
              responsive={{ tablet: { hide: { value: true } } }}
            >
              <span>
                <a href="https://www.redi-school.org/">ReDI School Website</a>
              </span>
              <span className="is-pulled-right">
                &copy; {year} By ReDI School
              </span>
            </Columns.Column>
          </Columns>
        </Section>
      </Container>
    </footer>
  );
};

export default Footer;
