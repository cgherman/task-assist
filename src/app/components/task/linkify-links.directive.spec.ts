import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ElementRef, Component, DebugElement } from '@angular/core';
import { LinkifyLinksDirective } from "./linkify-links.directive";
import { By } from '@angular/platform-browser';

describe('LinkifyLinksDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, LinkifyLinksDirective] 
    });

    fixture = TestBed.createComponent(TestComponent); 
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('div'));
  });

  it('should create an instance', () => {
    const directive = new LinkifyLinksDirective(renderer2Mock, inputEl);
    expect(directive).toBeTruthy();
  });

  it('should change not alter plain text', () => {
    fixture.componentInstance.text = "test";
    fixture.detectChanges();
    expect(inputEl.nativeElement.children[0].innerHTML).toBe('test');
  });

  it('should change alter text with http links', () => {
    fixture.componentInstance.text = "test http://link.com test";
    fixture.detectChanges();
    expect(inputEl.nativeElement.children[1].innerHTML).toContain('http://');
    expect(inputEl.nativeElement.children[1].innerHTML).toContain('href');
  });

  it('should change alter text with www links', () => {
    fixture.componentInstance.text = "test www.link.com test";
    fixture.detectChanges();
    expect(inputEl.nativeElement.children[1].innerHTML).toContain('http://');
    expect(inputEl.nativeElement.children[1].innerHTML).toContain('href');
  });

});

@Component({
  template: `<div appLinkifyLinks="{{text}}"></div>` 
})
class TestComponent {
  public text;
}

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
