import { Inter, Roboto, Rubik } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

const inter = Inter({ subsets: ["latin"] });

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const fonts = {
  rubik,
  roboto,
  inter,
};
