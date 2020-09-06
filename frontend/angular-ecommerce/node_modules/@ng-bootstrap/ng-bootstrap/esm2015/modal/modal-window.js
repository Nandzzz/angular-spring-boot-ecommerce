import { __decorate, __param } from "tslib";
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { getFocusableBoundaryElements } from '../util/focus-trap';
import { Key } from '../util/key';
import { ModalDismissReasons } from './modal-dismiss-reasons';
let NgbModalWindow = class NgbModalWindow {
    constructor(_document, _elRef, _zone) {
        this._document = _document;
        this._elRef = _elRef;
        this._zone = _zone;
        this._closed$ = new Subject();
        this._elWithFocus = null; // element that is focused prior to modal opening
        this.backdrop = true;
        this.keyboard = true;
        this.dismissEvent = new EventEmitter();
    }
    dismiss(reason) { this.dismissEvent.emit(reason); }
    ngOnInit() { this._elWithFocus = this._document.activeElement; }
    ngAfterViewInit() {
        const { nativeElement } = this._elRef;
        this._zone.runOutsideAngular(() => {
            fromEvent(nativeElement, 'keydown')
                .pipe(takeUntil(this._closed$), 
            // tslint:disable-next-line:deprecation
            filter(e => e.which === Key.Escape && this.keyboard))
                .subscribe(event => requestAnimationFrame(() => {
                if (!event.defaultPrevented) {
                    this._zone.run(() => this.dismiss(ModalDismissReasons.ESC));
                }
            }));
            // We're listening to 'mousedown' and 'mouseup' to prevent modal from closing when pressing the mouse
            // inside the modal dialog and releasing it outside
            let preventClose = false;
            fromEvent(this._dialogEl.nativeElement, 'mousedown')
                .pipe(takeUntil(this._closed$), tap(() => preventClose = false), switchMap(() => fromEvent(nativeElement, 'mouseup').pipe(takeUntil(this._closed$), take(1))), filter(({ target }) => nativeElement === target))
                .subscribe(() => { preventClose = true; });
            // We're listening to 'click' to dismiss modal on modal window click, except when:
            // 1. clicking on modal dialog itself
            // 2. closing was prevented by mousedown/up handlers
            // 3. clicking on scrollbar when the viewport is too small and modal doesn't fit (click is not triggered at all)
            fromEvent(nativeElement, 'click').pipe(takeUntil(this._closed$)).subscribe(({ target }) => {
                if (this.backdrop === true && nativeElement === target && !preventClose) {
                    this._zone.run(() => this.dismiss(ModalDismissReasons.BACKDROP_CLICK));
                }
                preventClose = false;
            });
        });
        if (!nativeElement.contains(document.activeElement)) {
            const autoFocusable = nativeElement.querySelector(`[ngbAutofocus]`);
            const firstFocusable = getFocusableBoundaryElements(nativeElement)[0];
            const elementToFocus = autoFocusable || firstFocusable || nativeElement;
            elementToFocus.focus();
        }
    }
    ngOnDestroy() {
        const body = this._document.body;
        const elWithFocus = this._elWithFocus;
        let elementToFocus;
        if (elWithFocus && elWithFocus['focus'] && body.contains(elWithFocus)) {
            elementToFocus = elWithFocus;
        }
        else {
            elementToFocus = body;
        }
        this._zone.runOutsideAngular(() => {
            setTimeout(() => elementToFocus.focus());
            this._elWithFocus = null;
        });
        this._closed$.next();
    }
};
NgbModalWindow.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: ElementRef },
    { type: NgZone }
];
__decorate([
    ViewChild('dialog', { static: true })
], NgbModalWindow.prototype, "_dialogEl", void 0);
__decorate([
    Input()
], NgbModalWindow.prototype, "ariaLabelledBy", void 0);
__decorate([
    Input()
], NgbModalWindow.prototype, "backdrop", void 0);
__decorate([
    Input()
], NgbModalWindow.prototype, "centered", void 0);
__decorate([
    Input()
], NgbModalWindow.prototype, "keyboard", void 0);
__decorate([
    Input()
], NgbModalWindow.prototype, "scrollable", void 0);
__decorate([
    Input()
], NgbModalWindow.prototype, "size", void 0);
__decorate([
    Input()
], NgbModalWindow.prototype, "windowClass", void 0);
__decorate([
    Output('dismiss')
], NgbModalWindow.prototype, "dismissEvent", void 0);
NgbModalWindow = __decorate([
    Component({
        selector: 'ngb-modal-window',
        host: {
            '[class]': '"modal fade show d-block" + (windowClass ? " " + windowClass : "")',
            'role': 'dialog',
            'tabindex': '-1',
            '[attr.aria-modal]': 'true',
            '[attr.aria-labelledby]': 'ariaLabelledBy',
        },
        template: `
    <div #dialog [class]="'modal-dialog' + (size ? ' modal-' + size : '') + (centered ? ' modal-dialog-centered' : '') +
     (scrollable ? ' modal-dialog-scrollable' : '')" role="document">
        <div class="modal-content"><ng-content></ng-content></div>
    </div>
    `,
        encapsulation: ViewEncapsulation.None,
        styles: ["ngb-modal-window .component-host-scrollable{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;overflow:hidden}"]
    }),
    __param(0, Inject(DOCUMENT))
], NgbModalWindow);
export { NgbModalWindow };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtd2luZG93LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvIiwic291cmNlcyI6WyJtb2RhbC9tb2RhbC13aW5kb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsYUFBYSxFQUNiLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDeEMsT0FBTyxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV2RSxPQUFPLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNoRSxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBb0I1RCxJQUFhLGNBQWMsR0FBM0IsTUFBYSxjQUFjO0lBaUJ6QixZQUM4QixTQUFjLEVBQVUsTUFBK0IsRUFBVSxLQUFhO1FBQTlFLGNBQVMsR0FBVCxTQUFTLENBQUs7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUF5QjtRQUFVLFVBQUssR0FBTCxLQUFLLENBQVE7UUFoQnBHLGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQy9CLGlCQUFZLEdBQW1CLElBQUksQ0FBQyxDQUFFLGlEQUFpRDtRQUt0RixhQUFRLEdBQXFCLElBQUksQ0FBQztRQUVsQyxhQUFRLEdBQUcsSUFBSSxDQUFDO1FBS04saUJBQVksR0FB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QUFDbkI7SUFBUixLQUFLLEVBQUU7NENBQWM7QUFDYjtJQUFSLEtBQUssRUFBRTttREFBcUI7QUFFVjtJQUFsQixNQUFNLENBQUMsU0FBUyxDQUFDO29EQUFtQztBQWYxQyxjQUFjO0lBbEIxQixTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsa0JBQWtCO1FBQzVCLElBQUksRUFBRTtZQUNKLFNBQVMsRUFBRSxvRUFBb0U7WUFDL0UsTUFBTSxFQUFFLFFBQVE7WUFDaEIsVUFBVSxFQUFFLElBQUk7WUFDaEIsbUJBQW1CLEVBQUUsTUFBTTtZQUMzQix3QkFBd0IsRUFBRSxnQkFBZ0I7U0FDM0M7UUFDRCxRQUFRLEVBQUU7Ozs7O0tBS1A7UUFDSCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7S0FFdEMsQ0FBQztJQW1CSyxXQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtHQWxCVixjQUFjLENBdUYxQjtTQXZGWSxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2Zyb21FdmVudCwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgc3dpdGNoTWFwLCB0YWtlLCB0YWtlVW50aWwsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge2dldEZvY3VzYWJsZUJvdW5kYXJ5RWxlbWVudHN9IGZyb20gJy4uL3V0aWwvZm9jdXMtdHJhcCc7XG5pbXBvcnQge0tleX0gZnJvbSAnLi4vdXRpbC9rZXknO1xuaW1wb3J0IHtNb2RhbERpc21pc3NSZWFzb25zfSBmcm9tICcuL21vZGFsLWRpc21pc3MtcmVhc29ucyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1tb2RhbC13aW5kb3cnLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzc10nOiAnXCJtb2RhbCBmYWRlIHNob3cgZC1ibG9ja1wiICsgKHdpbmRvd0NsYXNzID8gXCIgXCIgKyB3aW5kb3dDbGFzcyA6IFwiXCIpJyxcbiAgICAncm9sZSc6ICdkaWFsb2cnLFxuICAgICd0YWJpbmRleCc6ICctMScsXG4gICAgJ1thdHRyLmFyaWEtbW9kYWxdJzogJ3RydWUnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ2FyaWFMYWJlbGxlZEJ5JyxcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2ICNkaWFsb2cgW2NsYXNzXT1cIidtb2RhbC1kaWFsb2cnICsgKHNpemUgPyAnIG1vZGFsLScgKyBzaXplIDogJycpICsgKGNlbnRlcmVkID8gJyBtb2RhbC1kaWFsb2ctY2VudGVyZWQnIDogJycpICtcbiAgICAgKHNjcm9sbGFibGUgPyAnIG1vZGFsLWRpYWxvZy1zY3JvbGxhYmxlJyA6ICcnKVwiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPjxuZy1jb250ZW50PjwvbmctY29udGVudD48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICBgLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBzdHlsZVVybHM6IFsnLi9tb2RhbC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTmdiTW9kYWxXaW5kb3cgaW1wbGVtZW50cyBPbkluaXQsXG4gICAgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfY2xvc2VkJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHByaXZhdGUgX2VsV2l0aEZvY3VzOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7ICAvLyBlbGVtZW50IHRoYXQgaXMgZm9jdXNlZCBwcmlvciB0byBtb2RhbCBvcGVuaW5nXG5cbiAgQFZpZXdDaGlsZCgnZGlhbG9nJywge3N0YXRpYzogdHJ1ZX0pIHByaXZhdGUgX2RpYWxvZ0VsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBASW5wdXQoKSBhcmlhTGFiZWxsZWRCeTogc3RyaW5nO1xuICBASW5wdXQoKSBiYWNrZHJvcDogYm9vbGVhbiB8IHN0cmluZyA9IHRydWU7XG4gIEBJbnB1dCgpIGNlbnRlcmVkOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGtleWJvYXJkID0gdHJ1ZTtcbiAgQElucHV0KCkgc2Nyb2xsYWJsZTogc3RyaW5nO1xuICBASW5wdXQoKSBzaXplOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHdpbmRvd0NsYXNzOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgnZGlzbWlzcycpIGRpc21pc3NFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksIHByaXZhdGUgX2VsUmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSBfem9uZTogTmdab25lKSB7fVxuXG4gIGRpc21pc3MocmVhc29uKTogdm9pZCB7IHRoaXMuZGlzbWlzc0V2ZW50LmVtaXQocmVhc29uKTsgfVxuXG4gIG5nT25Jbml0KCkgeyB0aGlzLl9lbFdpdGhGb2N1cyA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7IH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgY29uc3Qge25hdGl2ZUVsZW1lbnR9ID0gdGhpcy5fZWxSZWY7XG4gICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cbiAgICAgIGZyb21FdmVudDxLZXlib2FyZEV2ZW50PihuYXRpdmVFbGVtZW50LCAna2V5ZG93bicpXG4gICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9jbG9zZWQkKSxcbiAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRlcHJlY2F0aW9uXG4gICAgICAgICAgICAgIGZpbHRlcihlID0+IGUud2hpY2ggPT09IEtleS5Fc2NhcGUgJiYgdGhpcy5rZXlib2FyZCkpXG4gICAgICAgICAgLnN1YnNjcmliZShldmVudCA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl96b25lLnJ1bigoKSA9PiB0aGlzLmRpc21pc3MoTW9kYWxEaXNtaXNzUmVhc29ucy5FU0MpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAvLyBXZSdyZSBsaXN0ZW5pbmcgdG8gJ21vdXNlZG93bicgYW5kICdtb3VzZXVwJyB0byBwcmV2ZW50IG1vZGFsIGZyb20gY2xvc2luZyB3aGVuIHByZXNzaW5nIHRoZSBtb3VzZVxuICAgICAgLy8gaW5zaWRlIHRoZSBtb2RhbCBkaWFsb2cgYW5kIHJlbGVhc2luZyBpdCBvdXRzaWRlXG4gICAgICBsZXQgcHJldmVudENsb3NlID0gZmFsc2U7XG4gICAgICBmcm9tRXZlbnQ8TW91c2VFdmVudD4odGhpcy5fZGlhbG9nRWwubmF0aXZlRWxlbWVudCwgJ21vdXNlZG93bicpXG4gICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9jbG9zZWQkKSwgdGFwKCgpID0+IHByZXZlbnRDbG9zZSA9IGZhbHNlKSxcbiAgICAgICAgICAgICAgc3dpdGNoTWFwKCgpID0+IGZyb21FdmVudDxNb3VzZUV2ZW50PihuYXRpdmVFbGVtZW50LCAnbW91c2V1cCcpLnBpcGUodGFrZVVudGlsKHRoaXMuX2Nsb3NlZCQpLCB0YWtlKDEpKSksXG4gICAgICAgICAgICAgIGZpbHRlcigoe3RhcmdldH0pID0+IG5hdGl2ZUVsZW1lbnQgPT09IHRhcmdldCkpXG4gICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7IHByZXZlbnRDbG9zZSA9IHRydWU7IH0pO1xuXG4gICAgICAvLyBXZSdyZSBsaXN0ZW5pbmcgdG8gJ2NsaWNrJyB0byBkaXNtaXNzIG1vZGFsIG9uIG1vZGFsIHdpbmRvdyBjbGljaywgZXhjZXB0IHdoZW46XG4gICAgICAvLyAxLiBjbGlja2luZyBvbiBtb2RhbCBkaWFsb2cgaXRzZWxmXG4gICAgICAvLyAyLiBjbG9zaW5nIHdhcyBwcmV2ZW50ZWQgYnkgbW91c2Vkb3duL3VwIGhhbmRsZXJzXG4gICAgICAvLyAzLiBjbGlja2luZyBvbiBzY3JvbGxiYXIgd2hlbiB0aGUgdmlld3BvcnQgaXMgdG9vIHNtYWxsIGFuZCBtb2RhbCBkb2Vzbid0IGZpdCAoY2xpY2sgaXMgbm90IHRyaWdnZXJlZCBhdCBhbGwpXG4gICAgICBmcm9tRXZlbnQ8TW91c2VFdmVudD4obmF0aXZlRWxlbWVudCwgJ2NsaWNrJykucGlwZSh0YWtlVW50aWwodGhpcy5fY2xvc2VkJCkpLnN1YnNjcmliZSgoe3RhcmdldH0pID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYmFja2Ryb3AgPT09IHRydWUgJiYgbmF0aXZlRWxlbWVudCA9PT0gdGFyZ2V0ICYmICFwcmV2ZW50Q2xvc2UpIHtcbiAgICAgICAgICB0aGlzLl96b25lLnJ1bigoKSA9PiB0aGlzLmRpc21pc3MoTW9kYWxEaXNtaXNzUmVhc29ucy5CQUNLRFJPUF9DTElDSykpO1xuICAgICAgICB9XG4gICAgICAgIHByZXZlbnRDbG9zZSA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpZiAoIW5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpIHtcbiAgICAgIGNvbnN0IGF1dG9Gb2N1c2FibGUgPSBuYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYFtuZ2JBdXRvZm9jdXNdYCkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBjb25zdCBmaXJzdEZvY3VzYWJsZSA9IGdldEZvY3VzYWJsZUJvdW5kYXJ5RWxlbWVudHMobmF0aXZlRWxlbWVudClbMF07XG5cbiAgICAgIGNvbnN0IGVsZW1lbnRUb0ZvY3VzID0gYXV0b0ZvY3VzYWJsZSB8fCBmaXJzdEZvY3VzYWJsZSB8fCBuYXRpdmVFbGVtZW50O1xuICAgICAgZWxlbWVudFRvRm9jdXMuZm9jdXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBib2R5ID0gdGhpcy5fZG9jdW1lbnQuYm9keTtcbiAgICBjb25zdCBlbFdpdGhGb2N1cyA9IHRoaXMuX2VsV2l0aEZvY3VzO1xuXG4gICAgbGV0IGVsZW1lbnRUb0ZvY3VzO1xuICAgIGlmIChlbFdpdGhGb2N1cyAmJiBlbFdpdGhGb2N1c1snZm9jdXMnXSAmJiBib2R5LmNvbnRhaW5zKGVsV2l0aEZvY3VzKSkge1xuICAgICAgZWxlbWVudFRvRm9jdXMgPSBlbFdpdGhGb2N1cztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudFRvRm9jdXMgPSBib2R5O1xuICAgIH1cbiAgICB0aGlzLl96b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gZWxlbWVudFRvRm9jdXMuZm9jdXMoKSk7XG4gICAgICB0aGlzLl9lbFdpdGhGb2N1cyA9IG51bGw7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jbG9zZWQkLm5leHQoKTtcbiAgfVxufVxuIl19