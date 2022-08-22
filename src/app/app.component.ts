import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // Populate category grid tile
  categories = [
    {
      name:'Meat', 
      description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. In, excepturi.',
      icon_name:'meat',
      alt:'Meat category icon'
    },
    {
      name:'Vegetables', 
      description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. In, excepturi.',
      icon_name:'vegetable',
      alt:'Vegetable category icon'
    },
    {
      name:'Seafood', 
      description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. In, excepturi.',
      icon_name:'seafood',
      alt:'Seafood category icon'
    },
    {
      name:'Beverages', 
      description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. In, excepturi.',
      icon_name:'beverages',
      alt:'Beverages category icon'
    },
    {
      name:'Canned Goods', 
      description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. In, excepturi.',
      icon_name:'canned-food',
      alt:'Canned Food category icon'
    },
    {
      name:'Dairy', 
      description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. In, excepturi.',
      icon_name:'dairy',
      alt:'Dairy category icon'
    },
    {
      name:'Personal Care', 
      description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. In, excepturi.',
      icon_name:'personal-hygiene',
      alt:'Personal care category icon'
    },
    {
      name:'Cleaners', 
      description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. In, excepturi.',
      icon_name:'cleaning-products',
      alt:'Cleaning category icon'
    },
    {
      name:'Fruits', 
      description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. In, excepturi.',
      icon_name:'fruits',
      alt:'Fruits category icon'
    },
    {
      name:'Bread',
      description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. In, excepturi.', 
      icon_name:'bread',
      alt:'Bread category icon'
    },
  ];

  stores = [
    {
      id:1,
      name:'SM Supermarket SM City Olongapo',
    },
    {
      id:2,
      name:'Puregold Olongapo',
    },
    {
      id:3,
      name:'SM City Olongapo Central Supermarket',
    },
    {
      id:4,
      name:"Choa's Supermarket",
    },
    {
      id:5,
      name:"Jeleebee",
    },
    {
      id:6,
      name:"Circle J General Store",
    },
    {
      id:7,
      name:"Oscar's Supermarket",
    },
    {
      id:8,
      name:"Vercons Supermarket",
    },
  ]

  constructor(public _router: Router) {}
  title = 'gocery';

  // Get name of clicked category tile
  categoryClick(icon_name: string){
    console.log(icon_name);
  }

}




