import fitz  # PyMuPDF
import os

# Path to your PDF file
# pdf_path = 'path_to_your_pdf_file.pdf'
# pdf_path = '../probInvGraphics/assets/probInvGraphics.pdf'
pdf_path = '../equivShapeGen/assets/equivShapeGen.pdf'

save_path = os.path.dirname(pdf_path)
save_name = os.path.basename(pdf_path).split('.')[0]

# Open the PDF file
pdf_document = fitz.open(pdf_path)


# Define desired DPI (e.g., 300 DPI)
dpi = 300
zoom = dpi / 72  # 72 DPI is the default resolution for PDFs

# Transformation matrix to scale the image
matrix = fitz.Matrix(zoom, zoom)

# Loop through each page
for page_number in range(len(pdf_document)):
    page = pdf_document.load_page(page_number)  # Load the page
    pix = page.get_pixmap(matrix=matrix)

    # Save the image as a PNG
    output_path = f'{save_name}_{page_number + 1}.png'
    output_path = os.path.join(save_path, output_path)
    pix.save(output_path)

# Close the document
pdf_document.close()
