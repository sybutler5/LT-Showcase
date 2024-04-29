import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductService } from '../../services/product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MainPageComponent } from './main-page.component';
import { SINGLE_PRODUCT_RESULT, MULTIPLE_PRODUCT_RESULT } from './../../../test/product-mock';
import { of, throwError } from "rxjs"
import { HttpErrorResponse } from '@angular/common/http';


describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let productService: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPageComponent, HttpClientTestingModule],
      providers: [ProductService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    productService = TestBed.inject(ProductService);
  })

  /*** Instantiation ***/ 
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly', () => {
    expect(component).toBeTruthy();
    expect(component.searchHasBeenRun).toBeFalse();
    expect(component.productId).toEqual("");
    expect(component.keyWord).toEqual("");
    expect(component.searchResults.length).toEqual(0);
    expect(component.errorMessage).toEqual("");
  });


  /*** ID Search ***/ 
  it('should clear key word when id search is run', () => {
    component.keyWord = 'key';
    component.searchById();

    expect(component.keyWord).toEqual('');
  });
  
  it('should handle id search result correctly', () => {
    spyOn(component.productService, "getJsonData").and.returnValue(of(SINGLE_PRODUCT_RESULT));
    spyOn(component, "handleSearchResults");
    spyOn(component, "handleSearchError");

    component.productId = '1';
    component.searchById();

    expect(component.errorMessage).toEqual("");
    expect(component.handleSearchResults).toHaveBeenCalled();
    expect(component.handleSearchError).toHaveBeenCalledTimes(0);
  });

  it('should display results of id search', () => {
    spyOn(component.productService, "getJsonData").and.returnValue(of(SINGLE_PRODUCT_RESULT));

    component.productId = '1';
    component.searchById();

    expect(component.searchResults.length).toEqual(1);
  });


  /*** Key Word Search ***/ 
  it('should clear id when key word search is run', () => {
    component.productId = '1';
    component.searchByKeyWord();

    expect(component.productId).toEqual('');
  });

  it('should handle key word search result correctly', () => {
    spyOn(component.productService, "getJsonData").and.returnValue(of(MULTIPLE_PRODUCT_RESULT));
    spyOn(component, "handleSearchResults");
    spyOn(component, "handleSearchError");

    component.keyWord = 'key';
    component.searchByKeyWord();

    expect(component.errorMessage).toEqual("");
    expect(component.handleSearchResults).toHaveBeenCalled();
    expect(component.handleSearchError).toHaveBeenCalledTimes(0);
  });

  it('should display results of key word search', () => {
    spyOn(component.productService, "getJsonData").and.returnValue(of(MULTIPLE_PRODUCT_RESULT));

    component.searchByKeyWord();
    
    expect(component.searchResults.length).toEqual(2);
  });

  /*** Empty Search ***/ 
  it('should route empty id search to empty key word search', () => {
    spyOn(component, "searchByKeyWord");

    component.productId = '';
    component.searchById();

    expect(component.errorMessage).toEqual("");
    expect(component.searchByKeyWord).toHaveBeenCalled();
  });

  /*** No Results Found ***/
  it('id search should process error response correctly', () => {
    spyOn(component.productService, "getJsonData").and.returnValue(throwError(() => new HttpErrorResponse({})));
    spyOn(component, "handleSearchResults");
    spyOn(component, "handleSearchError");

    component.searchById();

    expect(component.handleSearchResults).toHaveBeenCalledTimes(0);
    expect(component.handleSearchError).toHaveBeenCalled();
  });

  it('key word search should process error response correctly', () => {
    spyOn(component.productService, "getJsonData").and.returnValue(throwError(() => new HttpErrorResponse({})));
    spyOn(component, "handleSearchResults");
    spyOn(component, "handleSearchError");

    component.searchByKeyWord();

    expect(component.handleSearchResults).toHaveBeenCalledTimes(0);
    expect(component.handleSearchError).toHaveBeenCalled();
  });

  it('should show no products and display error message when error reponse received', () => {
    
    spyOn(component.productService, "getJsonData").and.returnValue(throwError(() => new HttpErrorResponse({'error': {'message': 'No Products Found'}})));

    component.searchByKeyWord();

    expect(component.noResultsMessage()).toEqual('No Products Found');
    expect(component.searchResults.length).toEqual(0);
  });

  it('should display default error message if error response does not have message', () => {
    
    spyOn(component.productService, "getJsonData").and.returnValue(throwError(() => new HttpErrorResponse({})));

    component.searchByKeyWord();

    expect(component.noResultsMessage()).toEqual('No results found. Please try another search.');
  });

  /*** Product Image Swap Functions ***/
  it('should cycle table images correctly when right arrow hit multiple times', () => {
    const productIndex = 0;
    const right = 1;
    component.productImagesDisplayed = [0];
    component.searchResults = [SINGLE_PRODUCT_RESULT];
    component.searchResults[productIndex].images = ['image1', 'image2', 'image3'];

    // hit right arrow multiple times and verify images are cycled through
    component.swapImage(right, productIndex);
    component.swapImage(right, productIndex);
    expect(component.productImagesDisplayed[0]).toEqual(2);
    component.swapImage(right, productIndex);
    expect(component.productImagesDisplayed[0]).toEqual(0);
    component.swapImage(right, productIndex);
    component.swapImage(right, productIndex);
    component.swapImage(right, productIndex);
    component.swapImage(right, productIndex);
    expect(component.productImagesDisplayed[0]).toEqual(1);
  });

  it('should cycle table images correctly when left arrow hit multiple times', () => {
    const productIndex = 0;
    const left = -1;
    component.productImagesDisplayed = [0];
    component.searchResults = [SINGLE_PRODUCT_RESULT];
    component.searchResults[productIndex].images = ['image1', 'image2', 'image3']

    // hit rileftght arrow multiple times and verify images are cycled through
    component.swapImage(left, productIndex);
    component.swapImage(left, productIndex);
    expect(component.productImagesDisplayed[0]).toEqual(1);
    component.swapImage(left, productIndex);
    expect(component.productImagesDisplayed[0]).toEqual(0);
    component.swapImage(left, productIndex);
    component.swapImage(left, productIndex);
    component.swapImage(left, productIndex);
    component.swapImage(left, productIndex);
    expect(component.productImagesDisplayed[0]).toEqual(2);
  });
});