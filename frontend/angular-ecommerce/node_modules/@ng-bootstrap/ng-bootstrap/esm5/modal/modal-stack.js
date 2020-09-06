import { __decorate, __param } from "tslib";
import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Inject, Injectable, Injector, NgZone, RendererFactory2, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { ngbFocusTrap } from '../util/focus-trap';
import { ContentRef } from '../util/popup';
import { ScrollBar } from '../util/scrollbar';
import { isDefined, isString } from '../util/util';
import { NgbModalBackdrop } from './modal-backdrop';
import { NgbActiveModal, NgbModalRef } from './modal-ref';
import { NgbModalWindow } from './modal-window';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../util/scrollbar";
var NgbModalStack = /** @class */ (function () {
    function NgbModalStack(_applicationRef, _injector, _document, _scrollBar, _rendererFactory, _ngZone) {
        var _this = this;
        this._applicationRef = _applicationRef;
        this._injector = _injector;
        this._document = _document;
        this._scrollBar = _scrollBar;
        this._rendererFactory = _rendererFactory;
        this._ngZone = _ngZone;
        this._activeWindowCmptHasChanged = new Subject();
        this._ariaHiddenValues = new Map();
        this._backdropAttributes = ['backdropClass'];
        this._modalRefs = [];
        this._windowAttributes = ['ariaLabelledBy', 'backdrop', 'centered', 'keyboard', 'scrollable', 'size', 'windowClass'];
        this._windowCmpts = [];
        // Trap focus on active WindowCmpt
        this._activeWindowCmptHasChanged.subscribe(function () {
            if (_this._windowCmpts.length) {
                var activeWindowCmpt = _this._windowCmpts[_this._windowCmpts.length - 1];
                ngbFocusTrap(_this._ngZone, activeWindowCmpt.location.nativeElement, _this._activeWindowCmptHasChanged);
                _this._revertAriaHidden();
                _this._setAriaHidden(activeWindowCmpt.location.nativeElement);
            }
        });
    }
    NgbModalStack.prototype.open = function (moduleCFR, contentInjector, content, options) {
        var _this = this;
        var containerEl = options.container instanceof HTMLElement ? options.container : isDefined(options.container) ?
            this._document.querySelector(options.container) :
            this._document.body;
        var renderer = this._rendererFactory.createRenderer(null, null);
        var revertPaddingForScrollBar = this._scrollBar.compensate();
        var removeBodyClass = function () {
            if (!_this._modalRefs.length) {
                renderer.removeClass(_this._document.body, 'modal-open');
                _this._revertAriaHidden();
            }
        };
        if (!containerEl) {
            throw new Error("The specified modal container \"" + (options.container || 'body') + "\" was not found in the DOM.");
        }
        var activeModal = new NgbActiveModal();
        var contentRef = this._getContentRef(moduleCFR, options.injector || contentInjector, content, activeModal, options);
        var backdropCmptRef = options.backdrop !== false ? this._attachBackdrop(moduleCFR, containerEl) : undefined;
        var windowCmptRef = this._attachWindowComponent(moduleCFR, containerEl, contentRef);
        var ngbModalRef = new NgbModalRef(windowCmptRef, contentRef, backdropCmptRef, options.beforeDismiss);
        this._registerModalRef(ngbModalRef);
        this._registerWindowCmpt(windowCmptRef);
        ngbModalRef.result.then(revertPaddingForScrollBar, revertPaddingForScrollBar);
        ngbModalRef.result.then(removeBodyClass, removeBodyClass);
        activeModal.close = function (result) { ngbModalRef.close(result); };
        activeModal.dismiss = function (reason) { ngbModalRef.dismiss(reason); };
        this._applyWindowOptions(windowCmptRef.instance, options);
        if (this._modalRefs.length === 1) {
            renderer.addClass(this._document.body, 'modal-open');
        }
        if (backdropCmptRef && backdropCmptRef.instance) {
            this._applyBackdropOptions(backdropCmptRef.instance, options);
        }
        return ngbModalRef;
    };
    NgbModalStack.prototype.dismissAll = function (reason) { this._modalRefs.forEach(function (ngbModalRef) { return ngbModalRef.dismiss(reason); }); };
    NgbModalStack.prototype.hasOpenModals = function () { return this._modalRefs.length > 0; };
    NgbModalStack.prototype._attachBackdrop = function (moduleCFR, containerEl) {
        var backdropFactory = moduleCFR.resolveComponentFactory(NgbModalBackdrop);
        var backdropCmptRef = backdropFactory.create(this._injector);
        this._applicationRef.attachView(backdropCmptRef.hostView);
        containerEl.appendChild(backdropCmptRef.location.nativeElement);
        return backdropCmptRef;
    };
    NgbModalStack.prototype._attachWindowComponent = function (moduleCFR, containerEl, contentRef) {
        var windowFactory = moduleCFR.resolveComponentFactory(NgbModalWindow);
        var windowCmptRef = windowFactory.create(this._injector, contentRef.nodes);
        this._applicationRef.attachView(windowCmptRef.hostView);
        containerEl.appendChild(windowCmptRef.location.nativeElement);
        return windowCmptRef;
    };
    NgbModalStack.prototype._applyWindowOptions = function (windowInstance, options) {
        this._windowAttributes.forEach(function (optionName) {
            if (isDefined(options[optionName])) {
                windowInstance[optionName] = options[optionName];
            }
        });
    };
    NgbModalStack.prototype._applyBackdropOptions = function (backdropInstance, options) {
        this._backdropAttributes.forEach(function (optionName) {
            if (isDefined(options[optionName])) {
                backdropInstance[optionName] = options[optionName];
            }
        });
    };
    NgbModalStack.prototype._getContentRef = function (moduleCFR, contentInjector, content, activeModal, options) {
        if (!content) {
            return new ContentRef([]);
        }
        else if (content instanceof TemplateRef) {
            return this._createFromTemplateRef(content, activeModal);
        }
        else if (isString(content)) {
            return this._createFromString(content);
        }
        else {
            return this._createFromComponent(moduleCFR, contentInjector, content, activeModal, options);
        }
    };
    NgbModalStack.prototype._createFromTemplateRef = function (content, activeModal) {
        var context = {
            $implicit: activeModal,
            close: function (result) { activeModal.close(result); },
            dismiss: function (reason) { activeModal.dismiss(reason); }
        };
        var viewRef = content.createEmbeddedView(context);
        this._applicationRef.attachView(viewRef);
        return new ContentRef([viewRef.rootNodes], viewRef);
    };
    NgbModalStack.prototype._createFromString = function (content) {
        var component = this._document.createTextNode("" + content);
        return new ContentRef([[component]]);
    };
    NgbModalStack.prototype._createFromComponent = function (moduleCFR, contentInjector, content, context, options) {
        var contentCmptFactory = moduleCFR.resolveComponentFactory(content);
        var modalContentInjector = Injector.create({ providers: [{ provide: NgbActiveModal, useValue: context }], parent: contentInjector });
        var componentRef = contentCmptFactory.create(modalContentInjector);
        var componentNativeEl = componentRef.location.nativeElement;
        if (options.scrollable) {
            componentNativeEl.classList.add('component-host-scrollable');
        }
        this._applicationRef.attachView(componentRef.hostView);
        // FIXME: we should here get rid of the component nativeElement
        // and use `[Array.from(componentNativeEl.childNodes)]` instead and remove the above CSS class.
        return new ContentRef([[componentNativeEl]], componentRef.hostView, componentRef);
    };
    NgbModalStack.prototype._setAriaHidden = function (element) {
        var _this = this;
        var parent = element.parentElement;
        if (parent && element !== this._document.body) {
            Array.from(parent.children).forEach(function (sibling) {
                if (sibling !== element && sibling.nodeName !== 'SCRIPT') {
                    _this._ariaHiddenValues.set(sibling, sibling.getAttribute('aria-hidden'));
                    sibling.setAttribute('aria-hidden', 'true');
                }
            });
            this._setAriaHidden(parent);
        }
    };
    NgbModalStack.prototype._revertAriaHidden = function () {
        this._ariaHiddenValues.forEach(function (value, element) {
            if (value) {
                element.setAttribute('aria-hidden', value);
            }
            else {
                element.removeAttribute('aria-hidden');
            }
        });
        this._ariaHiddenValues.clear();
    };
    NgbModalStack.prototype._registerModalRef = function (ngbModalRef) {
        var _this = this;
        var unregisterModalRef = function () {
            var index = _this._modalRefs.indexOf(ngbModalRef);
            if (index > -1) {
                _this._modalRefs.splice(index, 1);
            }
        };
        this._modalRefs.push(ngbModalRef);
        ngbModalRef.result.then(unregisterModalRef, unregisterModalRef);
    };
    NgbModalStack.prototype._registerWindowCmpt = function (ngbWindowCmpt) {
        var _this = this;
        this._windowCmpts.push(ngbWindowCmpt);
        this._activeWindowCmptHasChanged.next();
        ngbWindowCmpt.onDestroy(function () {
            var index = _this._windowCmpts.indexOf(ngbWindowCmpt);
            if (index > -1) {
                _this._windowCmpts.splice(index, 1);
                _this._activeWindowCmptHasChanged.next();
            }
        });
    };
    NgbModalStack.ctorParameters = function () { return [
        { type: ApplicationRef },
        { type: Injector },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
        { type: ScrollBar },
        { type: RendererFactory2 },
        { type: NgZone }
    ]; };
    NgbModalStack.ɵprov = i0.ɵɵdefineInjectable({ factory: function NgbModalStack_Factory() { return new NgbModalStack(i0.ɵɵinject(i0.ApplicationRef), i0.ɵɵinject(i0.INJECTOR), i0.ɵɵinject(i1.DOCUMENT), i0.ɵɵinject(i2.ScrollBar), i0.ɵɵinject(i0.RendererFactory2), i0.ɵɵinject(i0.NgZone)); }, token: NgbModalStack, providedIn: "root" });
    NgbModalStack = __decorate([
        Injectable({ providedIn: 'root' }),
        __param(2, Inject(DOCUMENT))
    ], NgbModalStack);
    return NgbModalStack;
}());
export { NgbModalStack };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtc3RhY2suanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC8iLCJzb3VyY2VzIjpbIm1vZGFsL21vZGFsLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLGNBQWMsRUFDZCx3QkFBd0IsRUFDeEIsWUFBWSxFQUNaLE1BQU0sRUFDTixVQUFVLEVBQ1YsUUFBUSxFQUNSLE1BQU0sRUFDTixnQkFBZ0IsRUFDaEIsV0FBVyxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFN0IsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxTQUFTLEVBQUUsUUFBUSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ2pELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBRWxELE9BQU8sRUFBQyxjQUFjLEVBQUUsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQUc5QztJQVNFLHVCQUNZLGVBQStCLEVBQVUsU0FBbUIsRUFBNEIsU0FBYyxFQUN0RyxVQUFxQixFQUFVLGdCQUFrQyxFQUFVLE9BQWU7UUFGdEcsaUJBWUM7UUFYVyxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQTRCLGNBQVMsR0FBVCxTQUFTLENBQUs7UUFDdEcsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7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QUFJLEVBQUUsQ0FBQzthQUN6QztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7Z0JBN0w0QixjQUFjO2dCQUFxQixRQUFRO2dEQUFHLE1BQU0sU0FBQyxRQUFRO2dCQUNsRSxTQUFTO2dCQUE0QixnQkFBZ0I7Z0JBQW1CLE1BQU07OztJQVgzRixhQUFhO1FBRHpCLFVBQVUsQ0FBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMsQ0FBQztRQVc0QyxXQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQVZoRixhQUFhLENBd016Qjt3QkFoT0Q7Q0FnT0MsQUF4TUQsSUF3TUM7U0F4TVksYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBcHBsaWNhdGlvblJlZixcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBDb21wb25lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0YWJsZSxcbiAgSW5qZWN0b3IsXG4gIE5nWm9uZSxcbiAgUmVuZGVyZXJGYWN0b3J5MixcbiAgVGVtcGxhdGVSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge25nYkZvY3VzVHJhcH0gZnJvbSAnLi4vdXRpbC9mb2N1cy10cmFwJztcbmltcG9ydCB7Q29udGVudFJlZn0gZnJvbSAnLi4vdXRpbC9wb3B1cCc7XG5pbXBvcnQge1Njcm9sbEJhcn0gZnJvbSAnLi4vdXRpbC9zY3JvbGxiYXInO1xuaW1wb3J0IHtpc0RlZmluZWQsIGlzU3RyaW5nfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtOZ2JNb2RhbEJhY2tkcm9wfSBmcm9tICcuL21vZGFsLWJhY2tkcm9wJztcbmltcG9ydCB7TmdiTW9kYWxPcHRpb25zfSBmcm9tICcuL21vZGFsLWNvbmZpZyc7XG5pbXBvcnQge05nYkFjdGl2ZU1vZGFsLCBOZ2JNb2RhbFJlZn0gZnJvbSAnLi9tb2RhbC1yZWYnO1xuaW1wb3J0IHtOZ2JNb2RhbFdpbmRvd30gZnJvbSAnLi9tb2RhbC13aW5kb3cnO1xuXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBOZ2JNb2RhbFN0YWNrIHtcbiAgcHJpdmF0ZSBfYWN0aXZlV2luZG93Q21wdEhhc0NoYW5nZWQgPSBuZXcgU3ViamVjdCgpO1xuICBwcml2YXRlIF9hcmlhSGlkZGVuVmFsdWVzOiBNYXA8RWxlbWVudCwgc3RyaW5nIHwgbnVsbD4gPSBuZXcgTWFwKCk7XG4gIHByaXZhdGUgX2JhY2tkcm9wQXR0cmlidXRlcyA9IFsnYmFja2Ryb3BDbGFzcyddO1xuICBwcml2YXRlIF9tb2RhbFJlZnM6IE5nYk1vZGFsUmVmW10gPSBbXTtcbiAgcHJpdmF0ZSBfd2luZG93QXR0cmlidXRlcyA9XG4gICAgICBbJ2FyaWFMYWJlbGxlZEJ5JywgJ2JhY2tkcm9wJywgJ2NlbnRlcmVkJywgJ2tleWJvYXJkJywgJ3Njcm9sbGFibGUnLCAnc2l6ZScsICd3aW5kb3dDbGFzcyddO1xuICBwcml2YXRlIF93aW5kb3dDbXB0czogQ29tcG9uZW50UmVmPE5nYk1vZGFsV2luZG93PltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9hcHBsaWNhdGlvblJlZjogQXBwbGljYXRpb25SZWYsIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvciwgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcbiAgICAgIHByaXZhdGUgX3Njcm9sbEJhcjogU2Nyb2xsQmFyLCBwcml2YXRlIF9yZW5kZXJlckZhY3Rvcnk6IFJlbmRlcmVyRmFjdG9yeTIsIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7XG4gICAgLy8gVHJhcCBmb2N1cyBvbiBhY3RpdmUgV2luZG93Q21wdFxuICAgIHRoaXMuX2FjdGl2ZVdpbmRvd0NtcHRIYXNDaGFuZ2VkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fd2luZG93Q21wdHMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZVdpbmRvd0NtcHQgPSB0aGlzLl93aW5kb3dDbXB0c1t0aGlzLl93aW5kb3dDbXB0cy5sZW5ndGggLSAxXTtcbiAgICAgICAgbmdiRm9jdXNUcmFwKHRoaXMuX25nWm9uZSwgYWN0aXZlV2luZG93Q21wdC5sb2NhdGlvbi5uYXRpdmVFbGVtZW50LCB0aGlzLl9hY3RpdmVXaW5kb3dDbXB0SGFzQ2hhbmdlZCk7XG4gICAgICAgIHRoaXMuX3JldmVydEFyaWFIaWRkZW4oKTtcbiAgICAgICAgdGhpcy5fc2V0QXJpYUhpZGRlbihhY3RpdmVXaW5kb3dDbXB0LmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb3Blbihtb2R1bGVDRlI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgY29udGVudEluamVjdG9yOiBJbmplY3RvciwgY29udGVudDogYW55LCBvcHRpb25zKTogTmdiTW9kYWxSZWYge1xuICAgIGNvbnN0IGNvbnRhaW5lckVsID0gb3B0aW9ucy5jb250YWluZXIgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCA/IG9wdGlvbnMuY29udGFpbmVyIDogaXNEZWZpbmVkKG9wdGlvbnMuY29udGFpbmVyKSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpb25zLmNvbnRhaW5lcikgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RvY3VtZW50LmJvZHk7XG4gICAgY29uc3QgcmVuZGVyZXIgPSB0aGlzLl9yZW5kZXJlckZhY3RvcnkuY3JlYXRlUmVuZGVyZXIobnVsbCwgbnVsbCk7XG5cbiAgICBjb25zdCByZXZlcnRQYWRkaW5nRm9yU2Nyb2xsQmFyID0gdGhpcy5fc2Nyb2xsQmFyLmNvbXBlbnNhdGUoKTtcbiAgICBjb25zdCByZW1vdmVCb2R5Q2xhc3MgPSAoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX21vZGFsUmVmcy5sZW5ndGgpIHtcbiAgICAgICAgcmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5fZG9jdW1lbnQuYm9keSwgJ21vZGFsLW9wZW4nKTtcbiAgICAgICAgdGhpcy5fcmV2ZXJ0QXJpYUhpZGRlbigpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoIWNvbnRhaW5lckVsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBzcGVjaWZpZWQgbW9kYWwgY29udGFpbmVyIFwiJHtvcHRpb25zLmNvbnRhaW5lciB8fCAnYm9keSd9XCIgd2FzIG5vdCBmb3VuZCBpbiB0aGUgRE9NLmApO1xuICAgIH1cblxuICAgIGNvbnN0IGFjdGl2ZU1vZGFsID0gbmV3IE5nYkFjdGl2ZU1vZGFsKCk7XG4gICAgY29uc3QgY29udGVudFJlZiA9XG4gICAgICAgIHRoaXMuX2dldENvbnRlbnRSZWYobW9kdWxlQ0ZSLCBvcHRpb25zLmluamVjdG9yIHx8IGNvbnRlbnRJbmplY3RvciwgY29udGVudCwgYWN0aXZlTW9kYWwsIG9wdGlvbnMpO1xuXG4gICAgbGV0IGJhY2tkcm9wQ21wdFJlZjogQ29tcG9uZW50UmVmPE5nYk1vZGFsQmFja2Ryb3A+fCB1bmRlZmluZWQgPVxuICAgICAgICBvcHRpb25zLmJhY2tkcm9wICE9PSBmYWxzZSA/IHRoaXMuX2F0dGFjaEJhY2tkcm9wKG1vZHVsZUNGUiwgY29udGFpbmVyRWwpIDogdW5kZWZpbmVkO1xuICAgIGxldCB3aW5kb3dDbXB0UmVmOiBDb21wb25lbnRSZWY8TmdiTW9kYWxXaW5kb3c+ID0gdGhpcy5fYXR0YWNoV2luZG93Q29tcG9uZW50KG1vZHVsZUNGUiwgY29udGFpbmVyRWwsIGNvbnRlbnRSZWYpO1xuICAgIGxldCBuZ2JNb2RhbFJlZjogTmdiTW9kYWxSZWYgPSBuZXcgTmdiTW9kYWxSZWYod2luZG93Q21wdFJlZiwgY29udGVudFJlZiwgYmFja2Ryb3BDbXB0UmVmLCBvcHRpb25zLmJlZm9yZURpc21pc3MpO1xuXG4gICAgdGhpcy5fcmVnaXN0ZXJNb2RhbFJlZihuZ2JNb2RhbFJlZik7XG4gICAgdGhpcy5fcmVnaXN0ZXJXaW5kb3dDbXB0KHdpbmRvd0NtcHRSZWYpO1xuICAgIG5nYk1vZGFsUmVmLnJlc3VsdC50aGVuKHJldmVydFBhZGRpbmdGb3JTY3JvbGxCYXIsIHJldmVydFBhZGRpbmdGb3JTY3JvbGxCYXIpO1xuICAgIG5nYk1vZGFsUmVmLnJlc3VsdC50aGVuKHJlbW92ZUJvZHlDbGFzcywgcmVtb3ZlQm9keUNsYXNzKTtcbiAgICBhY3RpdmVNb2RhbC5jbG9zZSA9IChyZXN1bHQ6IGFueSkgPT4geyBuZ2JNb2RhbFJlZi5jbG9zZShyZXN1bHQpOyB9O1xuICAgIGFjdGl2ZU1vZGFsLmRpc21pc3MgPSAocmVhc29uOiBhbnkpID0+IHsgbmdiTW9kYWxSZWYuZGlzbWlzcyhyZWFzb24pOyB9O1xuXG4gICAgdGhpcy5fYXBwbHlXaW5kb3dPcHRpb25zKHdpbmRvd0NtcHRSZWYuaW5zdGFuY2UsIG9wdGlvbnMpO1xuICAgIGlmICh0aGlzLl9tb2RhbFJlZnMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZW5kZXJlci5hZGRDbGFzcyh0aGlzLl9kb2N1bWVudC5ib2R5LCAnbW9kYWwtb3BlbicpO1xuICAgIH1cblxuICAgIGlmIChiYWNrZHJvcENtcHRSZWYgJiYgYmFja2Ryb3BDbXB0UmVmLmluc3RhbmNlKSB7XG4gICAgICB0aGlzLl9hcHBseUJhY2tkcm9wT3B0aW9ucyhiYWNrZHJvcENtcHRSZWYuaW5zdGFuY2UsIG9wdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gbmdiTW9kYWxSZWY7XG4gIH1cblxuICBkaXNtaXNzQWxsKHJlYXNvbj86IGFueSkgeyB0aGlzLl9tb2RhbFJlZnMuZm9yRWFjaChuZ2JNb2RhbFJlZiA9PiBuZ2JNb2RhbFJlZi5kaXNtaXNzKHJlYXNvbikpOyB9XG5cbiAgaGFzT3Blbk1vZGFscygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX21vZGFsUmVmcy5sZW5ndGggPiAwOyB9XG5cbiAgcHJpdmF0ZSBfYXR0YWNoQmFja2Ryb3AobW9kdWxlQ0ZSOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIGNvbnRhaW5lckVsOiBhbnkpOiBDb21wb25lbnRSZWY8TmdiTW9kYWxCYWNrZHJvcD4ge1xuICAgIGxldCBiYWNrZHJvcEZhY3RvcnkgPSBtb2R1bGVDRlIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoTmdiTW9kYWxCYWNrZHJvcCk7XG4gICAgbGV0IGJhY2tkcm9wQ21wdFJlZiA9IGJhY2tkcm9wRmFjdG9yeS5jcmVhdGUodGhpcy5faW5qZWN0b3IpO1xuICAgIHRoaXMuX2FwcGxpY2F0aW9uUmVmLmF0dGFjaFZpZXcoYmFja2Ryb3BDbXB0UmVmLmhvc3RWaWV3KTtcbiAgICBjb250YWluZXJFbC5hcHBlbmRDaGlsZChiYWNrZHJvcENtcHRSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG4gICAgcmV0dXJuIGJhY2tkcm9wQ21wdFJlZjtcbiAgfVxuXG4gIHByaXZhdGUgX2F0dGFjaFdpbmRvd0NvbXBvbmVudChtb2R1bGVDRlI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgY29udGFpbmVyRWw6IGFueSwgY29udGVudFJlZjogYW55KTpcbiAgICAgIENvbXBvbmVudFJlZjxOZ2JNb2RhbFdpbmRvdz4ge1xuICAgIGxldCB3aW5kb3dGYWN0b3J5ID0gbW9kdWxlQ0ZSLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KE5nYk1vZGFsV2luZG93KTtcbiAgICBsZXQgd2luZG93Q21wdFJlZiA9IHdpbmRvd0ZhY3RvcnkuY3JlYXRlKHRoaXMuX2luamVjdG9yLCBjb250ZW50UmVmLm5vZGVzKTtcbiAgICB0aGlzLl9hcHBsaWNhdGlvblJlZi5hdHRhY2hWaWV3KHdpbmRvd0NtcHRSZWYuaG9zdFZpZXcpO1xuICAgIGNvbnRhaW5lckVsLmFwcGVuZENoaWxkKHdpbmRvd0NtcHRSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG4gICAgcmV0dXJuIHdpbmRvd0NtcHRSZWY7XG4gIH1cblxuICBwcml2YXRlIF9hcHBseVdpbmRvd09wdGlvbnMod2luZG93SW5zdGFuY2U6IE5nYk1vZGFsV2luZG93LCBvcHRpb25zOiBPYmplY3QpOiB2b2lkIHtcbiAgICB0aGlzLl93aW5kb3dBdHRyaWJ1dGVzLmZvckVhY2goKG9wdGlvbk5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKGlzRGVmaW5lZChvcHRpb25zW29wdGlvbk5hbWVdKSkge1xuICAgICAgICB3aW5kb3dJbnN0YW5jZVtvcHRpb25OYW1lXSA9IG9wdGlvbnNbb3B0aW9uTmFtZV07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9hcHBseUJhY2tkcm9wT3B0aW9ucyhiYWNrZHJvcEluc3RhbmNlOiBOZ2JNb2RhbEJhY2tkcm9wLCBvcHRpb25zOiBPYmplY3QpOiB2b2lkIHtcbiAgICB0aGlzLl9iYWNrZHJvcEF0dHJpYnV0ZXMuZm9yRWFjaCgob3B0aW9uTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAoaXNEZWZpbmVkKG9wdGlvbnNbb3B0aW9uTmFtZV0pKSB7XG4gICAgICAgIGJhY2tkcm9wSW5zdGFuY2Vbb3B0aW9uTmFtZV0gPSBvcHRpb25zW29wdGlvbk5hbWVdO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0Q29udGVudFJlZihcbiAgICAgIG1vZHVsZUNGUjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBjb250ZW50SW5qZWN0b3I6IEluamVjdG9yLCBjb250ZW50OiBhbnksIGFjdGl2ZU1vZGFsOiBOZ2JBY3RpdmVNb2RhbCxcbiAgICAgIG9wdGlvbnM6IE5nYk1vZGFsT3B0aW9ucyk6IENvbnRlbnRSZWYge1xuICAgIGlmICghY29udGVudCkge1xuICAgICAgcmV0dXJuIG5ldyBDb250ZW50UmVmKFtdKTtcbiAgICB9IGVsc2UgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZikge1xuICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUZyb21UZW1wbGF0ZVJlZihjb250ZW50LCBhY3RpdmVNb2RhbCk7XG4gICAgfSBlbHNlIGlmIChpc1N0cmluZyhjb250ZW50KSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NyZWF0ZUZyb21TdHJpbmcoY29udGVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVGcm9tQ29tcG9uZW50KG1vZHVsZUNGUiwgY29udGVudEluamVjdG9yLCBjb250ZW50LCBhY3RpdmVNb2RhbCwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlRnJvbVRlbXBsYXRlUmVmKGNvbnRlbnQ6IFRlbXBsYXRlUmVmPGFueT4sIGFjdGl2ZU1vZGFsOiBOZ2JBY3RpdmVNb2RhbCk6IENvbnRlbnRSZWYge1xuICAgIGNvbnN0IGNvbnRleHQgPSB7XG4gICAgICAkaW1wbGljaXQ6IGFjdGl2ZU1vZGFsLFxuICAgICAgY2xvc2UocmVzdWx0KSB7IGFjdGl2ZU1vZGFsLmNsb3NlKHJlc3VsdCk7IH0sXG4gICAgICBkaXNtaXNzKHJlYXNvbikgeyBhY3RpdmVNb2RhbC5kaXNtaXNzKHJlYXNvbik7IH1cbiAgICB9O1xuICAgIGNvbnN0IHZpZXdSZWYgPSBjb250ZW50LmNyZWF0ZUVtYmVkZGVkVmlldyhjb250ZXh0KTtcbiAgICB0aGlzLl9hcHBsaWNhdGlvblJlZi5hdHRhY2hWaWV3KHZpZXdSZWYpO1xuICAgIHJldHVybiBuZXcgQ29udGVudFJlZihbdmlld1JlZi5yb290Tm9kZXNdLCB2aWV3UmVmKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUZyb21TdHJpbmcoY29udGVudDogc3RyaW5nKTogQ29udGVudFJlZiB7XG4gICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYCR7Y29udGVudH1gKTtcbiAgICByZXR1cm4gbmV3IENvbnRlbnRSZWYoW1tjb21wb25lbnRdXSk7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVGcm9tQ29tcG9uZW50KFxuICAgICAgbW9kdWxlQ0ZSOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIGNvbnRlbnRJbmplY3RvcjogSW5qZWN0b3IsIGNvbnRlbnQ6IGFueSwgY29udGV4dDogTmdiQWN0aXZlTW9kYWwsXG4gICAgICBvcHRpb25zOiBOZ2JNb2RhbE9wdGlvbnMpOiBDb250ZW50UmVmIHtcbiAgICBjb25zdCBjb250ZW50Q21wdEZhY3RvcnkgPSBtb2R1bGVDRlIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoY29udGVudCk7XG4gICAgY29uc3QgbW9kYWxDb250ZW50SW5qZWN0b3IgPVxuICAgICAgICBJbmplY3Rvci5jcmVhdGUoe3Byb3ZpZGVyczogW3twcm92aWRlOiBOZ2JBY3RpdmVNb2RhbCwgdXNlVmFsdWU6IGNvbnRleHR9XSwgcGFyZW50OiBjb250ZW50SW5qZWN0b3J9KTtcbiAgICBjb25zdCBjb21wb25lbnRSZWYgPSBjb250ZW50Q21wdEZhY3RvcnkuY3JlYXRlKG1vZGFsQ29udGVudEluamVjdG9yKTtcbiAgICBjb25zdCBjb21wb25lbnROYXRpdmVFbCA9IGNvbXBvbmVudFJlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50O1xuICAgIGlmIChvcHRpb25zLnNjcm9sbGFibGUpIHtcbiAgICAgIChjb21wb25lbnROYXRpdmVFbCBhcyBIVE1MRWxlbWVudCkuY2xhc3NMaXN0LmFkZCgnY29tcG9uZW50LWhvc3Qtc2Nyb2xsYWJsZScpO1xuICAgIH1cbiAgICB0aGlzLl9hcHBsaWNhdGlvblJlZi5hdHRhY2hWaWV3KGNvbXBvbmVudFJlZi5ob3N0Vmlldyk7XG4gICAgLy8gRklYTUU6IHdlIHNob3VsZCBoZXJlIGdldCByaWQgb2YgdGhlIGNvbXBvbmVudCBuYXRpdmVFbGVtZW50XG4gICAgLy8gYW5kIHVzZSBgW0FycmF5LmZyb20oY29tcG9uZW50TmF0aXZlRWwuY2hpbGROb2RlcyldYCBpbnN0ZWFkIGFuZCByZW1vdmUgdGhlIGFib3ZlIENTUyBjbGFzcy5cbiAgICByZXR1cm4gbmV3IENvbnRlbnRSZWYoW1tjb21wb25lbnROYXRpdmVFbF1dLCBjb21wb25lbnRSZWYuaG9zdFZpZXcsIGNvbXBvbmVudFJlZik7XG4gIH1cblxuICBwcml2YXRlIF9zZXRBcmlhSGlkZGVuKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBjb25zdCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgaWYgKHBhcmVudCAmJiBlbGVtZW50ICE9PSB0aGlzLl9kb2N1bWVudC5ib2R5KSB7XG4gICAgICBBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbikuZm9yRWFjaChzaWJsaW5nID0+IHtcbiAgICAgICAgaWYgKHNpYmxpbmcgIT09IGVsZW1lbnQgJiYgc2libGluZy5ub2RlTmFtZSAhPT0gJ1NDUklQVCcpIHtcbiAgICAgICAgICB0aGlzLl9hcmlhSGlkZGVuVmFsdWVzLnNldChzaWJsaW5nLCBzaWJsaW5nLmdldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKSk7XG4gICAgICAgICAgc2libGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3NldEFyaWFIaWRkZW4ocGFyZW50KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9yZXZlcnRBcmlhSGlkZGVuKCkge1xuICAgIHRoaXMuX2FyaWFIaWRkZW5WYWx1ZXMuZm9yRWFjaCgodmFsdWUsIGVsZW1lbnQpID0+IHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLl9hcmlhSGlkZGVuVmFsdWVzLmNsZWFyKCk7XG4gIH1cblxuICBwcml2YXRlIF9yZWdpc3Rlck1vZGFsUmVmKG5nYk1vZGFsUmVmOiBOZ2JNb2RhbFJlZikge1xuICAgIGNvbnN0IHVucmVnaXN0ZXJNb2RhbFJlZiA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fbW9kYWxSZWZzLmluZGV4T2YobmdiTW9kYWxSZWYpO1xuICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgdGhpcy5fbW9kYWxSZWZzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB0aGlzLl9tb2RhbFJlZnMucHVzaChuZ2JNb2RhbFJlZik7XG4gICAgbmdiTW9kYWxSZWYucmVzdWx0LnRoZW4odW5yZWdpc3Rlck1vZGFsUmVmLCB1bnJlZ2lzdGVyTW9kYWxSZWYpO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVnaXN0ZXJXaW5kb3dDbXB0KG5nYldpbmRvd0NtcHQ6IENvbXBvbmVudFJlZjxOZ2JNb2RhbFdpbmRvdz4pIHtcbiAgICB0aGlzLl93aW5kb3dDbXB0cy5wdXNoKG5nYldpbmRvd0NtcHQpO1xuICAgIHRoaXMuX2FjdGl2ZVdpbmRvd0NtcHRIYXNDaGFuZ2VkLm5leHQoKTtcblxuICAgIG5nYldpbmRvd0NtcHQub25EZXN0cm95KCgpID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fd2luZG93Q21wdHMuaW5kZXhPZihuZ2JXaW5kb3dDbXB0KTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHRoaXMuX3dpbmRvd0NtcHRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIHRoaXMuX2FjdGl2ZVdpbmRvd0NtcHRIYXNDaGFuZ2VkLm5leHQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19