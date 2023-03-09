import { Canvas } from "canvas";
export default function generateDefaultProfilePic(name: string, size = 200) {
  // Create a canvas object with the specified size
  const canvas = new Canvas(size, size);
  const ctx = canvas.getContext("2d");

  // Set the background color
  ctx.fillStyle = "#D4AF37";
  ctx.fillRect(0, 0, size, size);

  // Set the font style and color
  ctx.font = "bold 80px sans-serif";
  ctx.fillStyle = "#000";

  // Get the initials of the name
  const initials = name
    .split(" ")
    .map((word: any) => word[0])
    .join("");

  // Center the text in the canvas
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(initials, size / 2, size / 2);

  // Return the canvas as a PNG image
  return canvas.toDataURL();
}
