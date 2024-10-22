import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PropertyService } from '../../services/property.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-icons',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})
export class IconsComponent implements OnInit {
  iconForm!: FormGroup;
  icons: any;


  constructor(
    private fb: FormBuilder,
    private title: Title,
    private propertyService: PropertyService,
    private toast: ToastService
  ) {
    this.title.setTitle('Icons');
    this.iconForm = this.fb.group({
      icons: this.fb.array([])
    });
  }

  ngOnInit() {
    this.addIcon();
    this.getAllIcons();
  }

  get iconArray(): FormArray {
    return this.iconForm.get('icons') as FormArray;
  }

  addIcon() {
    this.iconArray.push(this.fb.group({
      name: ['', Validators.required],
      iconFile: [null, Validators.required]
    }));
  }

  removeIcon(index: number) {
    this.iconArray.removeAt(index);
  }

  onFileChange(event: any, index: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const formArrayControl = this.iconArray.at(index);
        if (formArrayControl) {
          formArrayControl.patchValue({
            iconFile: {
              base64: reader.result as string,
              size: file.size,
              name: file.name,
              mimeType: file.type
            }
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    for (const control of this.iconArray.controls) {
      const iconFile = control.get('iconFile')?.value;
      const iconName = control.get('name')?.value;

      if (iconFile && iconName) {
        const iconData = {
          size: iconFile.size,
          name: iconName,
          mimeType: iconFile.mimeType,
          data: iconFile.base64
        };

        try {
          const response = await this.propertyService.createIcons(iconData).toPromise();
          console.log(response);
          this.getAllIcons();
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  getAllIcons() {
    this.propertyService.getAllIcons().subscribe(
      (response: any) => {
        console.log(response);
        this.icons = response.responseObject;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  deleteIcon(id: any) {
    this.propertyService.deleteIcon(id).subscribe(
      (response: any) => {
        console.log(response);
        this.toast.showToast('success', 'Icon deleted successfully', '');
        this.getAllIcons();
      },
      (error: any) => {
        console.log(error);
        this.toast.showToast('error', 'Error while deleting Icon', '');
      }
    );
  }
}
