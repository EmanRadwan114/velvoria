import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-app-features',
  imports: [CommonModule],
  templateUrl: './app-features.component.html',
  styleUrl: './app-features.component.css'
})
export class AppFeaturesComponent {
 ArrayFeatures: {img:string, title: string; des: string }[] = [
{

  img:"fa-solid fa-truck-fast fa-3x",
  title:"Free Shipping",
  des:"Capped at $39 per order",
},
{

  img:"fa-solid fa-money-check-dollar fa-3x",
  title:"Securety Payments",
  des:"Up to 12 months installments",
},
{
  img:"fa-solid fa-exchange fa-3x",
  title:"14-Day Returns",
  des:"Shop with confidence",
},
{
  img:"fa-solid fa-swatchbook fa-3x " ,
  title:"Free Fabric Swatches",
  des:"Delivered to your door",
},
 ];
}
