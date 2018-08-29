import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { LinkifyLinksDirective } from "./linkify-links.directive";

describe('LinkifyLinksDirective', () => {
  let el: ElementRef;
 
  beforeEach(() => { 
    el = TestBed.createComponent(ElementRef);
  });

  it('should create an instance', () => {
    const directive = new LinkifyLinksDirective(renderer2Mock, el);
    expect(directive).toBeTruthy();
  });
});

const rootRendererMock =  {
  renderComponent: () => {
      return renderer2Mock;
  }
};

const renderer2Mock = jasmine.createSpyObj('renderer2Mock', [
  'destroy',
  'createElement',
  'createComment',
  'createText',
  'destroyNode',
  'appendChild',
  'insertBefore',
  'removeChild',
  'selectRootElement',
  'parentNode',
  'nextSibling',
  'setAttribute',
  'removeAttribute',
  'addClass',
  'removeClass',
  'setStyle',
  'removeStyle',
  'setProperty',
  'setValue',
  'listen'
]);
