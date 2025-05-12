import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-related-prod',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './related-prod.component.html',
})
export class RelatedProdComponent implements AfterViewInit {
  @ViewChild('slider') slider!: ElementRef;

  // products = [
  //   {
  //     name: 'Diamond Halo Stud Massa',
  //     price: 450,
  //     oldPrice: null,
  //     discount: null,
  //     rating: 0,
  //     image:
  //       'https://img.freepik.com/free-photo/vertical-shot-blue-chair-made-up-wooden-legs_181624-33152.jpg?ga=GA1.1.1736155907.1740125917&semt=ais_hybrid&w=740',
  //   },
  //   {
  //     name: 'Diamond Halo Stud Monte',
  //     price: 236,
  //     oldPrice: 945,
  //     discount: 75,
  //     rating: 0,
  //     image:
  //       'https://img.freepik.com/free-photo/grey-comfortable-armchair-isolated-white-background_181624-25295.jpg?ga=GA1.1.1736155907.1740125917&semt=ais_hybrid&w=740',
  //   },
  //   {
  //     name: 'Acamond Halo Stud Conse',
  //     price: 198,
  //     oldPrice: 550,
  //     discount: 64,
  //     rating: 5,
  //     image:
  //       'https://img.freepik.com/free-photo/beautiful-shot-stylish-grey-chair-isolated-white-background_181624-25232.jpg?ga=GA1.1.1736155907.1740125917&semt=ais_hybrid&w=740',
  //   },
  //   {
  //     name: 'Viamond Halo Stud Donec',
  //     price: 409,
  //     oldPrice: 775,
  //     discount: 47,
  //     rating: 4,
  //     image:
  //       'https://media.istockphoto.com/id/1490325659/photo/armchair.jpg?s=612x612&w=0&k=20&c=qIN0Gni0GstSVh6ong1rFApT_f7N-30HXn6DPU5rnQ8=',
  //   },
  //   {
  //     name: 'Diamond Halo Stud Massa',
  //     price: 450,
  //     oldPrice: null,
  //     discount: null,
  //     rating: 0,
  //     image:
  //       'https://media.istockphoto.com/id/176959132/photo/classical-interior-with-an-armchair.jpg?s=612x612&w=0&k=20&c=kOGIdnVTHkavahAVP0a10p57RH3DOWF4UxesGO7M2io=',
  //   },
  //   {
  //     name: 'Diamond Halo Stud Monte',
  //     price: 236,
  //     oldPrice: 945,
  //     discount: 75,
  //     rating: 0,
  //     image:
  //       'https://media.istockphoto.com/id/154926620/photo/armchair.jpg?s=612x612&w=0&k=20&c=lLR_lNVKwo2eiEl-i5QZlCuPWbu8JD06ZdBEmbGeYNI=',
  //   },
  //   {
  //     name: 'Acamond Halo Stud Conse',
  //     price: 198,
  //     oldPrice: 550,
  //     discount: 64,
  //     rating: 5,
  //     image:
  //       'https://media.istockphoto.com/id/133884817/photo/antique-chair.jpg?s=612x612&w=0&k=20&c=MzlVfjgBG9T6bMkKfTswJYyN0rSmq1nORd49W516WCo=',
  //   },
  //   {
  //     name: 'Viamond Halo Stud Donec',
  //     price: 409,
  //     oldPrice: 775,
  //     discount: 47,
  //     rating: 4,
  //     image:
  //       'https://media.istockphoto.com/id/505973586/photo/grey-armchair-isolated.jpg?s=612x612&w=0&k=20&c=8WHCjWGHpqEvY5O53drcHcclWRF3ZgvLfRIGx_iv0As=',
  //   },
  // ];

  products = [
    {
      _id: '1',
      title: 'Diamond Halo Stud Massa',
      price: 450,
      rating: 0,
      avgRating: 0,
      numberOfReviews: 0,
      thumbnail:
        'https://media.istockphoto.com/id/505973586/photo/grey-armchair-isolated.jpg?s=612x612&w=0&k=20&c=8WHCjWGHpqEvY5O53drcHcclWRF3ZgvLfRIGx_iv0As=',
      label: ['trendy'],
    },
    {
      _id: '2',
      title: 'Diamond Halo Stud Monte',
      price: 236,
      rating: 0,
      avgRating: 0,
      numberOfReviews: 0,
      thumbnail:
        'https://media.istockphoto.com/id/133884817/photo/antique-chair.jpg?s=612x612&w=0&k=20&c=MzlVfjgBG9T6bMkKfTswJYyN0rSmq1nORd49W516WCo=',
      label: ['hot'],
    },
    {
      _id: '3',
      title: 'Acamond Halo Stud Conse',
      price: 198,
      rating: 5,
      avgRating: 5,
      numberOfReviews: 12,
      thumbnail:
        'https://media.istockphoto.com/id/154926620/photo/armchair.jpg?s=612x612&w=0&k=20&c=lLR_lNVKwo2eiEl-i5QZlCuPWbu8JD06ZdBEmbGeYNI=',
      label: ['new'],
    },
    {
      _id: '4',
      title: 'Viamond Halo Stud Donec',
      price: 409,
      rating: 4,
      avgRating: 4,
      numberOfReviews: 8,
      thumbnail:
        'https://media.istockphoto.com/id/176959132/photo/classical-interior-with-an-armchair.jpg?s=612x612&w=0&k=20&c=kOGIdnVTHkavahAVP0a10p57RH3DOWF4UxesGO7M2io=',
      label: [],
    },
    {
      _id: '1',
      title: 'Diamond Halo Stud Massa',
      price: 450,
      rating: 0,
      avgRating: 0,
      numberOfReviews: 0,
      thumbnail:
        'https://media.istockphoto.com/id/505973586/photo/grey-armchair-isolated.jpg?s=612x612&w=0&k=20&c=8WHCjWGHpqEvY5O53drcHcclWRF3ZgvLfRIGx_iv0As=',
      label: ['trendy'],
    },
    {
      _id: '2',
      title: 'Diamond Halo Stud Monte',
      price: 236,
      rating: 0,
      avgRating: 0,
      numberOfReviews: 0,
      thumbnail:
        'https://media.istockphoto.com/id/133884817/photo/antique-chair.jpg?s=612x612&w=0&k=20&c=MzlVfjgBG9T6bMkKfTswJYyN0rSmq1nORd49W516WCo=',
      label: ['hot'],
    },
    {
      _id: '3',
      title: 'Acamond Halo Stud Conse',
      price: 198,
      rating: 5,
      avgRating: 5,
      numberOfReviews: 12,
      thumbnail:
        'https://media.istockphoto.com/id/154926620/photo/armchair.jpg?s=612x612&w=0&k=20&c=lLR_lNVKwo2eiEl-i5QZlCuPWbu8JD06ZdBEmbGeYNI=',
      label: ['new', 'trendy'],
    },
    {
      _id: '4',
      title: 'Viamond Halo Stud Donec',
      price: 409,
      rating: 4,
      avgRating: 4,
      numberOfReviews: 8,
      thumbnail:
        'https://media.istockphoto.com/id/176959132/photo/classical-interior-with-an-armchair.jpg?s=612x612&w=0&k=20&c=kOGIdnVTHkavahAVP0a10p57RH3DOWF4UxesGO7M2io=',
      label: [],
    },
  ];

  ngAfterViewInit(): void {
    this.slider.nativeElement.scrollLeft = 0;
  }

  scrollSlider(direction: number) {
    const scrollAmount = 280;
    this.slider.nativeElement.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    });
  }

  getStars(count: number) {
    return Array(5)
      .fill(0)
      .map((_, i) => i < count);
  }
}
