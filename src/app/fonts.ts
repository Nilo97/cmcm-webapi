import { Inter, Roboto, Rubik, Poppins } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({ subsets: ["latin"] });

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const fonts = {
  rubik,
  poppins,
  roboto,
  inter,
};
