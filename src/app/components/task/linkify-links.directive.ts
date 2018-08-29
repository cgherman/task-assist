import { Directive, HostBinding, Input, Renderer2, ElementRef, OnChanges } from '@angular/core';

@Directive({
  selector: '[appLinkifyLinks]',
  exportAs: 'appLinkifyLinks'
})
export class LinkifyLinksDirective {
  @Input() appLinkifyLinks: string;

  protected _elementClass: string[] = [];

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit() {
    this.linkify(this.el, this.appLinkifyLinks, ["www.", "http://", "https://"]);
  }
  
  // Discover URLs via "link indicators" and convert them to HTML anchor tags in place
  private linkify(el: any, text: string, linkIndicators: string[]) {
    var indexMap: number[];
    var posStart: number;

    // search for link indicators
    indexMap = linkIndicators.map(x => text.indexOf(x));

    // find smallest index where index >= 0
    // default min=a[0], replace min with smaller if >=0, replace min if min<0; returns -1 if nothing found
    posStart = indexMap.reduce((min, val) => (((val < min && val >= 0) || min < 0 ) ? val : min), indexMap[0]);

    // if something needs to be replaced, let's do it
    if (posStart >= 0) {
      var result: string;
      var posEnd = text.indexOf(" ", posStart);

      // write out prefix
      if (posStart > 0) {
        this.addText(el, text.substr(0, posStart));
      }

      // capture link
      var link: string;
      if (posEnd >= 0) {
        link = text.substring(posStart, posEnd);
      } else {
        link = text.substring(posStart, text.length);
      }

      // if link isn't likely valid as-is, then prepend HTTP
      if (link.substr(0, 1) != "/" && link.indexOf(":") < 0) {
        link = "http://" + link
      }

      // write out link
      this.addLink(el, this.makeLinkDesc(link), link);

      // transform suffix as needed and append
      if (posEnd >= 0) {
        // recurse
        this.linkify(el, text.substr(posEnd), linkIndicators);
      }

      return result;
    } else {
      this.addText(el, text);
    }
  }

  private addText(el: any, text: string) {
    this.renderer.appendChild(this.el.nativeElement, this.renderer.createText(text));
  }

  private addLink(el: any, value: string, link: string) {
    // main div container
    var container = this.renderer.createElement('div');
    this.renderer.setAttribute(container, 'class', 'linkified');

    // anchor tag
    var anchor = this.renderer.createElement('a');
    this.renderer.setAttribute(anchor, 'href', link);
    this.renderer.setAttribute(anchor, 'target', '_blank');    
    
    // anchor text
    var text = this.renderer.createText(value);
    
    // put it together
    this.renderer.appendChild(anchor, text);
    this.renderer.appendChild(container, anchor);
    this.renderer.appendChild(el.nativeElement, container);
  }

  private makeLinkDesc(link: string): string {
    var protocol = /^(.*:\/\/)/;
    var nonDomain = /(;|\/|\?|:|@|=|&|"|<|>|#|%|{|}|\^|~|\[\|\]|\||\\).*/;
    return link.replace(new RegExp(protocol), "").replace(new RegExp(nonDomain), "");
  }

}