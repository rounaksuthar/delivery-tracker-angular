import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiServicService } from '../service/api-servic.service';
import { SpinnerService } from '../service/spinner.service';
import { LocalStorageService } from '../service/local-storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent {
    @Input()
    orderType:any;

    @Output()
    pageHeading:any;

    bulkupload: FormGroup;
        selectedFile: File | null = null;

    orderUpload:boolean = true;
    salesUpload:boolean = false;

      userList: any[] = [];
      extension:String='xlsx';

      constructor(private fb: FormBuilder
        , private spinner: SpinnerService
        , private apiService: ApiServicService
        , private localStorage: LocalStorageService,
        private http: HttpClient) {
        this.bulkupload = new FormGroup({
          uploadfile: new FormControl(null)
        });
      }

      get f() { return this.bulkupload.controls; }

      changeswitch(isOrderUpload:boolean){
        this.orderUpload = isOrderUpload?true:false;
        this.salesUpload = isOrderUpload?false:true;
      }
      

      createbulkupload() {
          this.bulkupload = this.fb.group({
            uploadfile: ['', [Validators.required]]
          });
        }

        CheckFileExtension(): boolean{
          const chk_ext = this.bulkupload.value.uploadfile;
          const parts = chk_ext.split('.');
            if (parts.length > 1) {
              return this.extension === (parts.pop() || ''); // Use || '' to handle cases with no extension
            }
            return false;
        }
        onFileSelected(event: any): void {
            this.selectedFile = event.target.files[0];
        }

        uploadfilebutton(){
          if(!this.bulkupload.valid)
          {
            alert("Please upload file");
            return;
          }
           
          console.log(this.bulkupload.value);
          if(!this.CheckFileExtension()){
              alert("Please upload .xlsx file only")
          }

          const formData = new FormData();
          console.log(this.selectedFile);
          
          if(this.selectedFile)
          {
            const apiUrl = this.orderUpload ? "/order/addBulkOrder" : "/sales/addBulkSales";
            const userId = String(this.localStorage.getData("userId"));
            this.spinner.resetSpinner();
      
            this.spinner.requestStarted();
            formData.append('file', this.selectedFile, this.selectedFile.name);
            formData.append('userId',userId);
            
            this.apiService.bulkUpload(apiUrl,formData)
            .subscribe({
              next: (res) => {
                alert(res);
                this.spinner.requestEnded();
              }, error: err => {
                console.warn(err);
                alert("Internal Server Error " + err);
                this.spinner.requestEnded();
              }
            })
          }
          else{
            console.log("file not found");
          }
          
        }

      generateSalesReport() {
          const body = {userId: this.localStorage.getData("userId")};
          this.apiService.generateSalesReport(body).subscribe({
            next: (res) => {
                alert(res);
                this.spinner.requestEnded();
              }, error: err => {
                console.warn(err);
                alert("Internal Server Error " + err);
                this.spinner.requestEnded();
              }
          });
      }
      generateOrderReport() {
          const body = {userId: this.localStorage.getData("userId")};
          this.apiService.generateOrderReport(body).subscribe({
            next: (res) => {
                alert(res);
                this.spinner.requestEnded();
              }, error: err => {
                console.warn(err);
                alert("Internal Server Error " + err);
                this.spinner.requestEnded();
              }
          });
      }
}
