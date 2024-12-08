import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { PropertyService } from '../../../services/property.service';
import { ToastService } from '../../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-scheme-media',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './scheme-media.component.html',
  styleUrls: ['./scheme-media.component.scss']
})
export class SchemeMediaComponent implements OnInit {
  mediaForm!: FormGroup;
  photos: File[] = [];
  floorPlans: File[] = [];
  model: File[] = [];
  current: File[] = [];
  contactPictures: File[] = [];
  amenities: string[] = [];
  schemeId: any;

  videos: File[] = [];
  uploadedVideos: string[] = [];

  layouts: File[] = [];
  uploadedLayouts: string[] = [];

  carParking: File[] = [];
  uploadedCarParking: string[] = [];

  uploadedPhotos: File[] = [];
  uploadedVideo: File | null = null;
  uploadedFloorPlans: File[] = [];
  uploadedModel: File[] = [];
  uploadedCurrent: File[] = [];
  uploadedContactPictures: File[] = [];

  websiteMedia: any;
  mode: any;

  icons: any;
  selectedIconIds: number[] = [];

  // iconsList = [
  //   { id: 1, title: 'Rain Water Harvesting', iconPath: '../../../../assets/attachment-images/1.png' },
  //   { id: 2, title: 'Mini Theatre', iconPath: '../../../../assets/attachment-images/2.png' },
  //   { id: 3, title: 'Water Treatment Plant', iconPath: '../../../../assets/attachment-images/3.png' },
  //   { id: 4, title: 'Swimming Pool', iconPath: '../../../../assets/attachment-images/4.png' },
  //   { id: 5, title: 'Fire Alarm & Wet riser system', iconPath: '../../../../assets/attachment-images/5.png' },
  //   { id: 6, title: 'Reticulated Gas', iconPath: '../../../../assets/attachment-images/6.png' },
  //   { id: 7, title: 'Garbage collection room', iconPath: '../../../../assets/attachment-images/7.png' },
  //   { id: 8, title: 'Motion Sensor Lighting system in club house', iconPath: '../../../../assets/attachment-images/8.png' },
  //   { id: 9, title: 'CCTV Surveillance', iconPath: '../../../../assets/attachment-images/9.png' },
  //   { id: 10, title: 'Solar Powered LED Lights in common area', iconPath: '../../../../assets/attachment-images/10.png' },
  //   { id: 11, title: 'Clubhouse', iconPath: '../../../../assets/attachment-images/11.png' },
  //   { id: 12, title: 'Fitness Centre', iconPath: '../../../../assets/attachment-images/12.png' },
  //   { id: 13, title: 'Party Hall', iconPath: '../../../../assets/attachment-images/13.png' },
  //   { id: 14, title: 'Lifts with V3F & ARD', iconPath: '../../../../assets/attachment-images/14.png' },
  //   { id: 15, title: 'Water meters for all apartments Digital', iconPath: '../../../../assets/attachment-images/15.png' }
  // ]

  constructor(
    private fb: FormBuilder,
    private toast: ToastService,
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private title: Title,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.title.setTitle("Scheme Media");
  }

  ngOnInit(): void {
    this.mediaForm = this.fb.group({
      projectDescription: ['', Validators.required],
      geoTagLink: ['', Validators.required],
      pointOfContactName: ['', Validators.required],
      pointOfContactMobile: ['', Validators.required],
      pointOfContactEmail: ['', [Validators.required, Validators.email]],
      vamenities: [''],
    });
    this.route.queryParams.subscribe(params => {
      this.schemeId = params['id'];
      this.getWebsiteDataBySchemeId();
    });
    this.getAllIcons();
  }

  getWebsiteDataBySchemeId() {
    this.propertyService.getWebsiteDataBySchemeId(this.schemeId).subscribe(
      (response: any) => {
        console.log('Response:', response);
        if (response.responseObject.length === 0) {
          this.mode = "create";
        } else {
          this.mode = "edit";
          this.websiteMedia = response.responseObject[0];
          const icons = response.responseObject[0].icons.split(',').map(Number);
          console.log(icons);
          this.selectedIconIds = icons;
        }
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }

  onFileChange(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const filesArray = Array.from(input.files);
      if (type === 'photo') {
        this.photos.push(...filesArray);
      } else if (type === 'video') {
        this.videos = filesArray; // Assign the array directly
      } else if (type === 'floorPlan') {
        this.floorPlans.push(...filesArray);
      } else if (type === 'contactPicture') {
        this.contactPictures = filesArray; // Assign the array directly
      } else if (type === 'layout') {
        this.layouts = filesArray; // Assign the array directly
      } else if (type === 'carParking') {
        this.carParking = filesArray;
      } else if (type === 'model') {
        this.model.push(...filesArray);
      } else if (type === 'current') {
        this.current.push(...filesArray);
      }
    }
  }

  getFileName(file: File): string {
    return file.name;
  }

  async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await firstValueFrom(this.propertyService.fileUpload(formData));

      if (response.body?.responseObject) {
        console.log('Successfully uploaded scheme file:', response.body.responseObject);
        return response.body.responseObject;
      } else {
        throw new Error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async onSubmit(): Promise<void> {
    if (true) {
      try {
        const uploadFiles = async (files: File[]) => {
          return Promise.all(files.map(file => this.uploadFile(file)));
        };

        const [uploadedPhotos, uploadedFloorPlans, uploadedModel, uploadedCurrent] = await Promise.all([
          uploadFiles(this.photos),
          uploadFiles(this.floorPlans),
          uploadFiles(this.model),
          uploadFiles(this.current)
        ]);

        const uploadedVideos = this.videos.length ? await this.uploadFile(this.videos[0]) : '';
        const uploadedContactPictures = this.contactPictures.length ? await this.uploadFile(this.contactPictures[0]) : '';
        const uploadedLayouts = this.layouts.length ? await this.uploadFile(this.layouts[0]) : '';
        const uploadedCarParking = this.carParking.length ? await this.uploadFile(this.carParking[0]) : '';

        const {
          projectDescription,
          geoTagLink,
          pointOfContactName,
          pointOfContactMobile,
          pointOfContactEmail
        } = this.mediaForm.value;

        const formData = {
          projectDescription,
          geoTagLink,
          pointOfContactName,
          pointOfContactMobile,
          pointOfContactEmail,
          amenities: this.amenities.map(a => ({ amenities: a })),
          schemeImagePath: uploadedPhotos.map(path => ({ uploadSchemePhotosPath: path })),
          floorImagePath: uploadedFloorPlans.map(path => ({ uploadFloorPlanPath: path })),
          uploadSchemeVideosPath: uploadedVideos,
          layoutPath: uploadedLayouts,
          carParkingLayout: uploadedCarParking,
          uploadPointOfContactPicturePath: uploadedContactPictures,
          modelImagePath: uploadedModel.map(path => ({ modelFlatImagePath: path })),
          currentStatusImagePath: uploadedCurrent.map(path => ({ currentStatusImagePath: path })),
          icons: this.selectedIconIds.toString(),
          schemeId: this.schemeId
        };

        console.log(formData);

        this.propertyService.createSchemeMedia(formData).subscribe(
          response => {
            console.log('Successfully created scheme media data:', response);
            this.toast.showToast('success', 'Successfully created scheme media data', '');
            this.router.navigate(['/employee/all-schemes']);
          },
          error => {
            console.error('Error creating scheme media data:', error);
            this.toast.showToast('error', 'Error while creating scheme media data', '');
          }
        );
      } catch (error) {
        console.error('Error uploading files:', error);
        this.toast.showToast('error', 'Error uploading files', '');
      }
    } else {
      this.toast.showToast('warning', 'Please fill out all required fields', '');
    }
  }

  removeMedia(index: number, type: string): void {
    if (type === 'photo') this.photos.splice(index, 1);
    if (type === 'floorPlan') this.floorPlans.splice(index, 1);
    if (type === 'contactPicture') this.contactPictures.splice(index, 1);
  }

  removeUploadedVideo(): void {
    this.uploadedVideo = null;
  }

  addAmenity(): void {
    const amenity = this.mediaForm.get('vamenities')?.value;
    if (amenity) {
      this.amenities.push(amenity);
      this.mediaForm.get('vamenities')?.reset();
    }
  }

  removeAmenity(amenity: string): void {
    this.amenities = this.amenities.filter(a => a !== amenity);
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

  onIconsSelect(event: any) {
    this.selectedIconIds = event.value;
    console.log(this.selectedIconIds);
  }

  async editSchemeImages() {
    const uploadFiles = async (files: File[]) => {
      return Promise.all(files.map(file => this.uploadFile(file)));
    };

    try {
      const uploadedPhotos = await uploadFiles(this.photos);
      uploadedPhotos.forEach(path => {
        this.websiteMedia.schemeImagePath.push({ uploadSchemePhotosPath: path });
      });
      console.log('Updated websiteMedia:', this.websiteMedia);
      this.updateSchemeMedia();
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

  async editSchemeVideo() {
    try {
      const uploadedVideos = this.videos.length ? await this.uploadFile(this.videos[0]) : '';
      this.websiteMedia.uploadSchemeVideosPath = uploadedVideos;
      console.log('Updated websiteMedia:', this.websiteMedia);
      this.updateSchemeMedia();
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

  async editSchemeLayout() {
    try {
      const uploadedLayouts = this.layouts.length ? await this.uploadFile(this.layouts[0]) : '';
      this.websiteMedia.layoutPath = uploadedLayouts;
      console.log('Updated websiteMedia:', this.websiteMedia);
      this.updateSchemeMedia();
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

  async editSchemeCarParking() {
    try {
      const uploadedCarParking = this.carParking.length ? await this.uploadFile(this.carParking[0]) : '';
      this.websiteMedia.carParkingLayout = uploadedCarParking;
      console.log('Updated websiteMedia:', this.websiteMedia);
      this.updateSchemeMedia();
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

  async editSchemeFloorPlans() {
    const uploadFiles = async (files: File[]) => {
      return Promise.all(files.map(file => this.uploadFile(file)));
    };

    try {
      const uploadedFloorPlans = await uploadFiles(this.floorPlans);
      uploadedFloorPlans.forEach(path => {
        this.websiteMedia.floorImagePath.push({ uploadFloorPlanPath: path });
      });
      console.log('Updated websiteMedia:', this.websiteMedia);
      this.updateSchemeMedia();
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

  async editSchemeModel() {
    const uploadFiles = async (files: File[]) => {
      return Promise.all(files.map(file => this.uploadFile(file)));
    };

    try {
      const uploadedModel = await uploadFiles(this.model);
      console.log(this.websiteMedia);
      uploadedModel.forEach(path => {
        this.websiteMedia.modelImagePathDTO.push({ modelFlatImagePath: path });
      });
      console.log('Updated websiteMedia:', this.websiteMedia);
      this.updateSchemeMedia();
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

  async editSchemeCurrent() {
    const uploadFiles = async (files: File[]) => {
      return Promise.all(files.map(file => this.uploadFile(file)));
    };

    try {
      const uploadedCurrent = await uploadFiles(this.current);
      uploadedCurrent.forEach(path => {
        this.websiteMedia.currentImageStatus.push({ currentStatusImagePath: path });
      });
      console.log('Updated websiteMedia:', this.websiteMedia);
      this.updateSchemeMedia();
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

  async editSchemeContactPicture() {
    try {
      const uploadedContactPictures = this.contactPictures.length ? await this.uploadFile(this.contactPictures[0]) : '';
      this.websiteMedia.uploadPointOfContactPicturePath = uploadedContactPictures;
      console.log('Updated websiteMedia:', this.websiteMedia);
      this.updateSchemeMedia();
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

  async editSchemeAmenities() {
    try {
      this.amenities.map(a => ({ amenities: a })).forEach(amenity => {
        this.websiteMedia.amenities.push(amenity);
      });
      console.log('Updated websiteMedia:', this.websiteMedia);
      this.updateSchemeMedia();
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

  deleteSchemeImage(id: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.propertyService.deleteSchemeImage(id).subscribe(
          (response: any) => {
            console.log(response);
            this.getWebsiteDataBySchemeId();
          },
          (error: any) => {
            console.error(error);
          }
        );
      }
    });
  }

  deleteFloorImage(id: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.propertyService.deleteFloorImage(id).subscribe(
          (response: any) => {
            console.log(response);
            this.getWebsiteDataBySchemeId();
          },
          (error: any) => {
            console.error(error);
          }
        );
      }
    });
  }

  deleteModelImage(id: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.propertyService.deleteModelImage(id).subscribe(
          (response: any) => {
            console.log(response);
            this.getWebsiteDataBySchemeId();
          },
          (error: any) => {
            console.error(error);
          }
        );
      }
    });
  }

  deleteCurrentImage(id: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.propertyService.deleteCurrentImage(id).subscribe(
          (response: any) => {
            console.log(response);
            this.getWebsiteDataBySchemeId();
          },
          (error: any) => {
            console.error(error);
          }
        );
      }
    });
  }

  convertArrayToString(array: number[]): string {
    return array.join(',');
  }

  updateSchemeMedia() {
    debugger
    console.log(this.selectedIconIds);
    const { schemeData, currentImageStatus, modelImagePathDTO, icons, ...updatedWebsiteMedia } = this.websiteMedia;
    const data = {
      schemeId: parseInt(this.schemeId),
      updateCurrentStatusImage: currentImageStatus,
      modelImagePath: modelImagePathDTO,
      icons: this.convertArrayToString(this.selectedIconIds),
      ...updatedWebsiteMedia
    };
    console.log(data);
    this.propertyService.updateSchemeMedia(data).subscribe(
      (response: any) => {
        console.log(response);
        this.toast.showToast('success', "Scheme media data updated successfully", "")
        this.getWebsiteDataBySchemeId();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  deleteAmenity(id: any) {
    this.propertyService.deleteAmenities(id).subscribe(
      (response: any) => {
        console.log(response);
        this.getWebsiteDataBySchemeId();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  goTo(route: any) {
    this.router.navigateByUrl(route);
  }


}

