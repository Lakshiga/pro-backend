import  createCanvas  from 'canvas';
import fs from 'fs';

export function generateMatchDraw(matches, eventName) {
  const canvas = createCanvas(800, 600);
  const context = canvas.getContext('2d');

  // Background
  context.fillStyle = '#f9f9f9';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Title
  context.fillStyle = '#333';
  context.font = 'bold 24px Arial';
  context.fillText(eventName, 50, 50);

  // Draw matches
  context.font = '18px Arial';
  const matchSpacing = 40;
  matches.forEach((match, index) => {
    const yPosition = 100 + index * matchSpacing;
    context.fillText(`${match.player1} vs ${match.player2}`, 50, yPosition);
  });

  // Save the image as PNG
  const buffer = canvas.toBuffer('image/png');
  const filePath = `./match_draws/${eventName.replace(/\s+/g, '_')}_draw.png`;

  // Ensure the directory exists before writing
  fs.mkdirSync('./match_draws', { recursive: true });
  fs.writeFileSync(filePath, buffer);

  console.log('Match draw image created successfully!');
}
