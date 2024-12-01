import { Component, inject } from '@angular/core';

import { jsPDF } from 'jspdf';

import html2canvas from 'html2canvas';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { CoverPageService, ICoverPageData } from '../../services/cover-page.service';

@Component({
  selector: 'app-cover-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './cover-page.component.html',
  styleUrl: './cover-page.component.css',
})
export class CoverPageComponent {
  selectedColor = '#00af4f';
  displayModal = false;
  coverPageService =  inject(CoverPageService);

  formBuilder = inject(FormBuilder);
  headerForm: FormGroup;

  ngOnInit(): void {
    // Retrieve data from local storage or use default values
    this.initializeForm(this.coverPageService.getData())
    console.log('Les info cover page: ', this.coverPageService.getData());
  }

  get f() {
    return this.headerForm.controls;
  }

  initializeForm(headerData: ICoverPageData): void {
    this.headerForm = this.formBuilder.group({
      school_name: headerData.school_name,
      teacher_name: headerData.teacher_name,
      class: headerData.class,
      group_name : headerData.group_name,
      year_year : headerData.year_year,
      color: headerData.color
    });
  }

  // Save the data to local storage when called
  saveCoverPageData(): void {
    console.log('Data to save: ', this.headerForm.value);
    this.coverPageService.saveData(this.headerForm.value);
    this.displayModal = false;
  }

  // Fonction pour changer la couleur lorsque l'utilisateur en sélectionne une nouvelle
  onColorChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedColor = input.value;
  }

  clearData() {
    if( confirm('Voulez-vous réinitialiser les données ?') ) {
      this.coverPageService.clearData();
      this.initializeForm(this.coverPageService.defaultData)
    }
  }

  // function cleanProfessorName(name) {
  //     // Séparer le nom en mots
  //     const nameParts = name.split(' ');
  //     // Retirer le premier élément (M. ou Mme)
  //     const lastName = nameParts.slice(1).join(' ');
  //     // Supprimer les points et remplacer les espaces par des underscores
  //     return lastName.replace(/\./g, '').replace(/\s+/g, '_');
  // }

  generateFileName() {
    // Récupérer les valeurs du formulaire
    const className = this.f['class'].value;
    const groupName = this.f['group_name'].value;
    const teacherName = this.f['teacher_name'].value;

    // Nettoyer le nom du professeur pour retirer "M." ou "Mme", enlever les espaces, et remplacer les points
    // const cleanedTeacherName = cleanProfessorName(teacherName);

    // Concaténer pour créer le nom du fichier avec des underscores à la place des espaces
    // const fileName = `${className}_${groupName}_${cleanedTeacherName}.pdf`.replace(/\s+/g, '_');
    const fileName = `${className}_${groupName}_${teacherName}`
      .replace(/\s+/g, '_')
      .replace(/\./g, '');
    return fileName;
  }

  async generatePdf() {
    // const { jsPDF } = window.jspdf;
    const jsPdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const element = document.getElementById('pg-content');

    // Use html2canvas to convert the HTML element to a canvas
    const canvas = await html2canvas(element, {
      scale: 4, // Increase resolution
      useCORS: true,
      logging: true,
      width: element.offsetWidth,
      height: element.offsetHeight,
    });

    // Get canvas as image
    // const imgData = canvas.toDataURL('image/png', 0.75);
    const imgData = canvas.toDataURL('image/png');

    // Calculate the width and height for the PDF page (A4 size is 595x842 points)
    const pdfWidth = jsPdf.internal.pageSize.getWidth();
    const pdfHeight = jsPdf.internal.pageSize.getHeight();

    // Scale the image to fit within the PDF page (reduce size if necessary)
    const canvasWidth = canvas.width / 2;
    const canvasHeight = canvas.height / 2;

    const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);

    const imgWidth = canvasWidth * ratio;
    const imgHeight = canvasHeight * ratio;

    // Center the image on the PDF page
    const xOffset = (pdfWidth - imgWidth) / 2;
    const yOffset = (pdfHeight - imgHeight) / 2;
    console.log(
      `xoffset: ${xOffset}, yoffset: ${yOffset}, imgw: ${imgWidth}, imgh: ${imgHeight}`
    );
    // Add the image to jsPDF
    // jsPdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
    jsPdf.addImage(
      imgData,
      'PNG',
      xOffset - 15,
      yOffset - 30,
      imgWidth + 35,
      imgHeight + 60
    );

    // Save or open the generated PDF
    const fileNameToSave = `${this.generateFileName()}.pdf`;
    // jsPdf.save(fileNameToSave);
    // jsPdf.save('doc.pdf');

    // Or to preview in browser:
    // window.open(jsPdf.output('bloburl'));

    // Générer le fichier PDF en tant que Blob
    const blob = jsPdf.output('blob');

    // Créer une URL pour le Blob
    const blobUrl = URL.createObjectURL(blob);

    // Créer un lien <a> caché et le déclencher
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileNameToSave; // Définir le nom de fichier pour le téléchargement
    // a.download = 'doc_ng.pdf'; // Définir le nom de fichier pour le téléchargement
    document.body.appendChild(a);
    a.click(); // Simuler le clic sur le lien pour déclencher le téléchargement
    document.body.removeChild(a); // Supprimer le lien après le clic
  }

}
