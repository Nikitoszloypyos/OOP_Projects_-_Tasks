export async function slide01(presentation, ctx) {
  const slide = presentation.slides.add();
  slide.background.fill = { color: "#F7F8FC" };

  const title = slide.shapes.add();
  title.frame = { left: 80, top: 72, width: 1120, height: 84 };
  title.text = "Task Management System";
  title.text.style = {
    fontSize: 28,
    fontFace: "Arial",
    bold: true,
    color: "#111827",
  };
  title.line = { color: "#F7F8FC", transparency: 100 };

  const body = slide.shapes.add();
  body.frame = { left: 80, top: 188, width: 840, height: 220 };
  body.text = "Система управления проектами, задачами и командным взаимодействием";
  body.text.style = {
    fontSize: 20,
    fontFace: "Arial",
    color: "#334155",
  };
  body.line = { color: "#F7F8FC", transparency: 100 };

  const accent = slide.shapes.add();
  accent.frame = { left: 80, top: 472, width: 240, height: 10 };
  accent.fill = { color: "#2563EB" };
  accent.line = { color: "#2563EB", transparency: 100 };

  return slide;
}
