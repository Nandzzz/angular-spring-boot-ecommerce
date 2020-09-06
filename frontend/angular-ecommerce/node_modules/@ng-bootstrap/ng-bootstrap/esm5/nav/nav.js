import { __decorate, __param } from "tslib";
import { AfterContentChecked, AfterContentInit, Attribute, ChangeDetectorRef, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, OnInit, Output, QueryList, TemplateRef } from '@angular/core';
import { isDefined } from '../util/util';
import { NgbNavConfig } from './nav-config';
var isValidNavId = function (id) { return isDefined(id) && id !== ''; };
var ɵ0 = isValidNavId;
var navCounter = 0;
/**
 * This directive must be used to wrap content to be displayed in the nav.
 *
 * @since 5.2.0
 */
var NgbNavContent = /** @class */ (function () {
    function NgbNavContent(templateRef) {
        this.templateRef = templateRef;
    }
    NgbNavContent.ctorParameters = function () { return [
        { type: TemplateRef }
    ]; };
    NgbNavContent = __decorate([
        Directive({ selector: 'ng-template[ngbNavContent]' })
    ], NgbNavContent);
    return NgbNavContent;
}());
export { NgbNavContent };
/**
 * The directive used to group nav link and related nav content. As well as set nav identifier and some options.
 *
 * @since 5.2.0
 */
var NgbNavItem = /** @class */ (function () {
    function NgbNavItem(nav, elementRef) {
        this.elementRef = elementRef;
        /**
         * If `true`, the current nav item is disabled and can't be toggled by user.
         *
         * Nevertheless disabled nav can be selected programmatically via the `.select()` method and the `[activeId]` binding.
         */
        this.disabled = false;
        // TODO: cf https://github.com/angular/angular/issues/30106
        this._nav = nav;
    }
    NgbNavItem.prototype.ngAfterContentChecked = function () {
        // We are using @ContentChildren instead of @ContentChild as in the Angular version being used
        // only @ContentChildren allows us to specify the {descendants: false} option.
        // Without {descendants: false} we are hitting bugs described in:
        // https://github.com/ng-bootstrap/ng-bootstrap/issues/2240
        this.contentTpl = this.contentTpls.first;
    };
    NgbNavItem.prototype.ngOnInit = function () {
        if (!isDefined(this.domId)) {
            this.domId = "ngb-nav-" + navCounter++;
        }
    };
    Object.defineProperty(NgbNavItem.prototype, "active", {
        get: function () { return this._nav.activeId === this.id; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgbNavItem.prototype, "id", {
        get: function () { return isValidNavId(this._id) ? this._id : this.domId; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgbNavItem.prototype, "panelDomId", {
        get: function () { return this.domId + "-panel"; },
        enumerable: true,
        configurable: true
    });
    NgbNavItem.prototype.isPanelInDom = function () {
        return (isDefined(this.destroyOnHide) ? !this.destroyOnHide : !this._nav.destroyOnHide) || this.active;
    };
    NgbNavItem.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [forwardRef(function () { return NgbNav; }),] }] },
        { type: ElementRef }
    ]; };
    __decorate([
        Input()
    ], NgbNavItem.prototype, "destroyOnHide", void 0);
    __decorate([
        Input()
    ], NgbNavItem.prototype, "disabled", void 0);
    __decorate([
        Input()
    ], NgbNavItem.prototype, "domId", void 0);
    __decorate([
        Input('ngbNavItem')
    ], NgbNavItem.prototype, "_id", void 0);
    __decorate([
        ContentChildren(NgbNavContent, { descendants: false })
    ], NgbNavItem.prototype, "contentTpls", void 0);
    NgbNavItem = __decorate([
        Directive({ selector: '[ngbNavItem]', exportAs: 'ngbNavItem', host: { '[class.nav-item]': 'true' } }),
        __param(0, Inject(forwardRef(function () { return NgbNav; })))
    ], NgbNavItem);
    return NgbNavItem;
}());
export { NgbNavItem };
/**
 * A nav directive that helps with implementing tabbed navigation components.
 *
 * @since 5.2.0
 */
var NgbNav = /** @class */ (function () {
    function NgbNav(role, config, _cd) {
        this.role = role;
        this._cd = _cd;
        /**
         * The event emitted after the active nav changes
         * The payload of the event is the newly active nav id
         *
         * If you want to prevent nav change, you should use `(navChange)` event
         */
        this.activeIdChange = new EventEmitter();
        /**
         * The nav change event emitted right before the nav change happens on user click.
         *
         * This event won't be emitted if nav is changed programmatically via `[activeId]` or `.select()`.
         *
         * See [`NgbNavChangeEvent`](#/components/nav/api#NgbNavChangeEvent) for payload details.
         */
        this.navChange = new EventEmitter();
        this.destroyOnHide = config.destroyOnHide;
        this.orientation = config.orientation;
        this.roles = config.roles;
    }
    NgbNav.prototype.click = function (item) {
        if (!item.disabled) {
            this._updateActiveId(item.id);
        }
    };
    /**
     * Selects the nav with the given id and shows its associated pane.
     * Any other nav that was previously selected becomes unselected and its associated pane is hidden.
     */
    NgbNav.prototype.select = function (id) { this._updateActiveId(id, false); };
    NgbNav.prototype.ngAfterContentInit = function () {
        if (!isDefined(this.activeId)) {
            var nextId = this.items.first ? this.items.first.id : null;
            if (isValidNavId(nextId)) {
                this._updateActiveId(nextId, false);
                this._cd.detectChanges();
            }
        }
    };
    NgbNav.prototype._updateActiveId = function (nextId, emitNavChange) {
        if (emitNavChange === void 0) { emitNavChange = true; }
        if (this.activeId !== nextId) {
            var defaultPrevented_1 = false;
            if (emitNavChange) {
                this.navChange.emit({ activeId: this.activeId, nextId: nextId, preventDefault: function () { defaultPrevented_1 = true; } });
            }
            if (!defaultPrevented_1) {
                this.activeId = nextId;
                this.activeIdChange.emit(nextId);
            }
        }
    };
    NgbNav.ctorParameters = function () { return [
        { type: String, decorators: [{ type: Attribute, args: ['role',] }] },
        { type: NgbNavConfig },
        { type: ChangeDetectorRef }
    ]; };
    __decorate([
        Input()
    ], NgbNav.prototype, "activeId", void 0);
    __decorate([
        Output()
    ], NgbNav.prototype, "activeIdChange", void 0);
    __decorate([
        Input()
    ], NgbNav.prototype, "destroyOnHide", void 0);
    __decorate([
        Input()
    ], NgbNav.prototype, "orientation", void 0);
    __decorate([
        Input()
    ], NgbNav.prototype, "roles", void 0);
    __decorate([
        ContentChildren(NgbNavItem)
    ], NgbNav.prototype, "items", void 0);
    __decorate([
        Output()
    ], NgbNav.prototype, "navChange", void 0);
    NgbNav = __decorate([
        Directive({
            selector: '[ngbNav]',
            exportAs: 'ngbNav',
            host: {
                '[class.nav]': 'true',
                '[class.flex-column]': "orientation === 'vertical'",
                '[attr.aria-orientation]': "orientation === 'vertical' && roles === 'tablist' ? 'vertical' : undefined",
                '[attr.role]': "role ? role : roles ? 'tablist' : undefined",
            }
        }),
        __param(0, Attribute('role'))
    ], NgbNav);
    return NgbNav;
}());
export { NgbNav };
/**
 * A directive to put on the nav link.
 *
 * @since 5.2.0
 */
var NgbNavLink = /** @class */ (function () {
    function NgbNavLink(role, navItem, nav) {
        this.role = role;
        this.navItem = navItem;
        this.nav = nav;
    }
    NgbNavLink.prototype.hasNavItemClass = function () {
        // with alternative markup we have to add `.nav-item` class, because `ngbNavItem` is on the ng-container
        return this.navItem.elementRef.nativeElement.nodeType === Node.COMMENT_NODE;
    };
    NgbNavLink.ctorParameters = function () { return [
        { type: String, decorators: [{ type: Attribute, args: ['role',] }] },
        { type: NgbNavItem },
        { type: NgbNav }
    ]; };
    NgbNavLink = __decorate([
        Directive({
            selector: 'a[ngbNavLink]',
            host: {
                '[id]': 'navItem.domId',
                '[class.nav-link]': 'true',
                '[class.nav-item]': 'hasNavItemClass()',
                '[attr.role]': "role ? role : nav.roles ? 'tab' : undefined",
                'href': '',
                '[class.active]': 'navItem.active',
                '[class.disabled]': 'navItem.disabled',
                '[attr.tabindex]': 'navItem.disabled ? -1 : undefined',
                '[attr.aria-controls]': 'navItem.isPanelInDom() ? navItem.panelDomId : null',
                '[attr.aria-selected]': 'navItem.active',
                '[attr.aria-disabled]': 'navItem.disabled',
                '(click)': 'nav.click(navItem); $event.preventDefault()'
            }
        }),
        __param(0, Attribute('role'))
    ], NgbNavLink);
    return NgbNavLink;
}());
export { NgbNavLink };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvIiwic291cmNlcyI6WyJuYXYvbmF2LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsbUJBQW1CLEVBQ25CLGdCQUFnQixFQUNoQixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFDVCxXQUFXLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRTFDLElBQU0sWUFBWSxHQUFHLFVBQUMsRUFBTyxJQUFLLE9BQUEsU0FBUyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQTFCLENBQTBCLENBQUM7O0FBRTdELElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztBQWlCbkI7Ozs7R0FJRztBQUVIO0lBQ0UsdUJBQW1CLFdBQTZCO1FBQTdCLGdCQUFXLEdBQVgsV0FBVyxDQUFrQjtJQUFHLENBQUM7O2dCQUFwQixXQUFXOztJQURoQyxhQUFhO1FBRHpCLFNBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSw0QkFBNEIsRUFBQyxDQUFDO09BQ3ZDLGFBQWEsQ0FFekI7SUFBRCxvQkFBQztDQUFBLEFBRkQsSUFFQztTQUZZLGFBQWE7QUFLMUI7Ozs7R0FJRztBQUVIO0lBcUNFLG9CQUE4QyxHQUFHLEVBQVMsVUFBMkI7UUFBM0IsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7UUE1QnJGOzs7O1dBSUc7UUFDTSxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBd0J4QiwyREFBMkQ7UUFDM0QsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7SUFDbEIs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RSxlQUFlO2dCQUN2QixrQkFBa0IsRUFBRSxNQUFNO2dCQUMxQixrQkFBa0IsRUFBRSxtQkFBbUI7Z0JBQ3ZDLGFBQWEsRUFBRSw2Q0FBNkM7Z0JBQzVELE1BQU0sRUFBRSxFQUFFO2dCQUNWLGdCQUFnQixFQUFFLGdCQUFnQjtnQkFDbEMsa0JBQWtCLEVBQUUsa0JBQWtCO2dCQUN0QyxpQkFBaUIsRUFBRSxtQ0FBbUM7Z0JBQ3RELHNCQUFzQixFQUFFLG9EQUFvRDtnQkFDNUUsc0JBQXNCLEVBQUUsZ0JBQWdCO2dCQUN4QyxzQkFBc0IsRUFBRSxrQkFBa0I7Z0JBQzFDLFNBQVMsRUFBRSw2Q0FBNkM7YUFDekQ7U0FDRixDQUFDO1FBRWEsV0FBQSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7T0FEbkIsVUFBVSxDQU90QjtJQUFELGlCQUFDO0NBQUEsQUFQRCxJQU9DO1NBUFksVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFRlbXBsYXRlUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtpc0RlZmluZWR9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQge05nYk5hdkNvbmZpZ30gZnJvbSAnLi9uYXYtY29uZmlnJztcblxuY29uc3QgaXNWYWxpZE5hdklkID0gKGlkOiBhbnkpID0+IGlzRGVmaW5lZChpZCkgJiYgaWQgIT09ICcnO1xuXG5sZXQgbmF2Q291bnRlciA9IDA7XG5cbi8qKlxuICogQ29udGV4dCBwYXNzZWQgdG8gdGhlIG5hdiBjb250ZW50IHRlbXBsYXRlLlxuICpcbiAqIFNlZSBbdGhpcyBkZW1vXSgjL2NvbXBvbmVudHMvbmF2L2V4YW1wbGVzI2tlZXAtY29udGVudCkgYXMgdGhlIGV4YW1wbGUuXG4gKlxuICogQHNpbmNlIDUuMi4wXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdiTmF2Q29udGVudENvbnRleHQge1xuICAvKipcbiAgICogSWYgYHRydWVgLCBjdXJyZW50IG5hdiBjb250ZW50IGlzIHZpc2libGUgYW5kIGFjdGl2ZVxuICAgKi9cbiAgJGltcGxpY2l0OiBib29sZWFuO1xufVxuXG5cbi8qKlxuICogVGhpcyBkaXJlY3RpdmUgbXVzdCBiZSB1c2VkIHRvIHdyYXAgY29udGVudCB0byBiZSBkaXNwbGF5ZWQgaW4gdGhlIG5hdi5cbiAqXG4gKiBAc2luY2UgNS4yLjBcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JOYXZDb250ZW50XSd9KVxuZXhwb3J0IGNsYXNzIE5nYk5hdkNvbnRlbnQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4pIHt9XG59XG5cblxuLyoqXG4gKiBUaGUgZGlyZWN0aXZlIHVzZWQgdG8gZ3JvdXAgbmF2IGxpbmsgYW5kIHJlbGF0ZWQgbmF2IGNvbnRlbnQuIEFzIHdlbGwgYXMgc2V0IG5hdiBpZGVudGlmaWVyIGFuZCBzb21lIG9wdGlvbnMuXG4gKlxuICogQHNpbmNlIDUuMi4wXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW25nYk5hdkl0ZW1dJywgZXhwb3J0QXM6ICduZ2JOYXZJdGVtJywgaG9zdDogeydbY2xhc3MubmF2LWl0ZW1dJzogJ3RydWUnfX0pXG5leHBvcnQgY2xhc3MgTmdiTmF2SXRlbSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudENoZWNrZWQsIE9uSW5pdCB7XG4gIHByaXZhdGUgX25hdjogTmdiTmF2O1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIG5vbi1hY3RpdmUgY3VycmVudCBuYXYgaXRlbSBjb250ZW50IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIERPTVxuICAgKiBPdGhlcndpc2UgaXQgd2lsbCBqdXN0IGJlIGhpZGRlblxuICAgKi9cbiAgQElucHV0KCkgZGVzdHJveU9uSGlkZTtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCB0aGUgY3VycmVudCBuYXYgaXRlbSBpcyBkaXNhYmxlZCBhbmQgY2FuJ3QgYmUgdG9nZ2xlZCBieSB1c2VyLlxuICAgKlxuICAgKiBOZXZlcnRoZWxlc3MgZGlzYWJsZWQgbmF2IGNhbiBiZSBzZWxlY3RlZCBwcm9ncmFtbWF0aWNhbGx5IHZpYSB0aGUgYC5zZWxlY3QoKWAgbWV0aG9kIGFuZCB0aGUgYFthY3RpdmVJZF1gIGJpbmRpbmcuXG4gICAqL1xuICBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUaGUgaWQgdXNlZCBmb3IgdGhlIERPTSBlbGVtZW50cy5cbiAgICogTXVzdCBiZSB1bmlxdWUgaW5zaWRlIHRoZSBkb2N1bWVudCBpbiBjYXNlIHlvdSBoYXZlIG11bHRpcGxlIGBuZ2JOYXZgcyBvbiB0aGUgcGFnZS5cbiAgICpcbiAgICogQXV0b2dlbmVyYXRlZCBhcyBgbmdiLW5hdi1YWFhgIGlmIG5vdCBwcm92aWRlZC5cbiAgICovXG4gIEBJbnB1dCgpIGRvbUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBpZCB1c2VkIGFzIGEgbW9kZWwgZm9yIGFjdGl2ZSBuYXYuXG4gICAqIEl0IGNhbiBiZSBhbnl0aGluZywgYnV0IG11c3QgYmUgdW5pcXVlIGluc2lkZSBvbmUgYG5nYk5hdmAuXG4gICAqXG4gICAqIFRoZSBvbmx5IGxpbWl0YXRpb24gaXMgdGhhdCBpdCBpcyBub3QgcG9zc2libGUgdG8gaGF2ZSB0aGUgYCcnYCAoZW1wdHkgc3RyaW5nKSBhcyBpZCxcbiAgICogYmVjYXVzZSBgIG5nYk5hdkl0ZW0gYCwgYG5nYk5hdkl0ZW09JydgIGFuZCBgW25nYk5hdkl0ZW1dPVwiJydcImAgYXJlIGluZGlzdGluZ3Vpc2hhYmxlXG4gICAqL1xuICBASW5wdXQoJ25nYk5hdkl0ZW0nKSBfaWQ6IGFueTtcblxuICBjb250ZW50VHBsOiBOZ2JOYXZDb250ZW50IHwgbnVsbDtcblxuICBAQ29udGVudENoaWxkcmVuKE5nYk5hdkNvbnRlbnQsIHtkZXNjZW5kYW50czogZmFsc2V9KSBjb250ZW50VHBsczogUXVlcnlMaXN0PE5nYk5hdkNvbnRlbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBOZ2JOYXYpKSBuYXYsIHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmPGFueT4pIHtcbiAgICAvLyBUT0RPOiBjZiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8zMDEwNlxuICAgIHRoaXMuX25hdiA9IG5hdjtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICAvLyBXZSBhcmUgdXNpbmcgQENvbnRlbnRDaGlsZHJlbiBpbnN0ZWFkIG9mIEBDb250ZW50Q2hpbGQgYXMgaW4gdGhlIEFuZ3VsYXIgdmVyc2lvbiBiZWluZyB1c2VkXG4gICAgLy8gb25seSBAQ29udGVudENoaWxkcmVuIGFsbG93cyB1cyB0byBzcGVjaWZ5IHRoZSB7ZGVzY2VuZGFudHM6IGZhbHNlfSBvcHRpb24uXG4gICAgLy8gV2l0aG91dCB7ZGVzY2VuZGFudHM6IGZhbHNlfSB3ZSBhcmUgaGl0dGluZyBidWdzIGRlc2NyaWJlZCBpbjpcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9pc3N1ZXMvMjI0MFxuICAgIHRoaXMuY29udGVudFRwbCA9IHRoaXMuY29udGVudFRwbHMuZmlyc3Q7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIWlzRGVmaW5lZCh0aGlzLmRvbUlkKSkge1xuICAgICAgdGhpcy5kb21JZCA9IGBuZ2ItbmF2LSR7bmF2Q291bnRlcisrfWA7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGFjdGl2ZSgpIHsgcmV0dXJuIHRoaXMuX25hdi5hY3RpdmVJZCA9PT0gdGhpcy5pZDsgfVxuXG4gIGdldCBpZCgpIHsgcmV0dXJuIGlzVmFsaWROYXZJZCh0aGlzLl9pZCkgPyB0aGlzLl9pZCA6IHRoaXMuZG9tSWQ7IH1cblxuICBnZXQgcGFuZWxEb21JZCgpIHsgcmV0dXJuIGAke3RoaXMuZG9tSWR9LXBhbmVsYDsgfVxuXG4gIGlzUGFuZWxJbkRvbSgpIHtcbiAgICByZXR1cm4gKGlzRGVmaW5lZCh0aGlzLmRlc3Ryb3lPbkhpZGUpID8gIXRoaXMuZGVzdHJveU9uSGlkZSA6ICF0aGlzLl9uYXYuZGVzdHJveU9uSGlkZSkgfHwgdGhpcy5hY3RpdmU7XG4gIH1cbn1cblxuXG4vKipcbiAqIEEgbmF2IGRpcmVjdGl2ZSB0aGF0IGhlbHBzIHdpdGggaW1wbGVtZW50aW5nIHRhYmJlZCBuYXZpZ2F0aW9uIGNvbXBvbmVudHMuXG4gKlxuICogQHNpbmNlIDUuMi4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ2JOYXZdJyxcbiAgZXhwb3J0QXM6ICduZ2JOYXYnLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5uYXZdJzogJ3RydWUnLFxuICAgICdbY2xhc3MuZmxleC1jb2x1bW5dJzogYG9yaWVudGF0aW9uID09PSAndmVydGljYWwnYCxcbiAgICAnW2F0dHIuYXJpYS1vcmllbnRhdGlvbl0nOiBgb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgJiYgcm9sZXMgPT09ICd0YWJsaXN0JyA/ICd2ZXJ0aWNhbCcgOiB1bmRlZmluZWRgLFxuICAgICdbYXR0ci5yb2xlXSc6IGByb2xlID8gcm9sZSA6IHJvbGVzID8gJ3RhYmxpc3QnIDogdW5kZWZpbmVkYCxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JOYXYgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0IHtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX29yaWVudGF0aW9uOiBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9yb2xlczogYm9vbGVhbiB8IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGlkIG9mIHRoZSBuYXYgdGhhdCBzaG91bGQgYmUgYWN0aXZlXG4gICAqXG4gICAqIFlvdSBjb3VsZCBhbHNvIHVzZSB0aGUgYC5zZWxlY3QoKWAgbWV0aG9kIGFuZCB0aGUgYChuYXZDaGFuZ2UpYCBldmVudFxuICAgKi9cbiAgQElucHV0KCkgYWN0aXZlSWQ6IGFueTtcblxuICAvKipcbiAgICogVGhlIGV2ZW50IGVtaXR0ZWQgYWZ0ZXIgdGhlIGFjdGl2ZSBuYXYgY2hhbmdlc1xuICAgKiBUaGUgcGF5bG9hZCBvZiB0aGUgZXZlbnQgaXMgdGhlIG5ld2x5IGFjdGl2ZSBuYXYgaWRcbiAgICpcbiAgICogSWYgeW91IHdhbnQgdG8gcHJldmVudCBuYXYgY2hhbmdlLCB5b3Ugc2hvdWxkIHVzZSBgKG5hdkNoYW5nZSlgIGV2ZW50XG4gICAqL1xuICBAT3V0cHV0KCkgYWN0aXZlSWRDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCBub24tYWN0aXZlIG5hdiBjb250ZW50IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIERPTVxuICAgKiBPdGhlcndpc2UgaXQgd2lsbCBqdXN0IGJlIGhpZGRlblxuICAgKi9cbiAgQElucHV0KCkgZGVzdHJveU9uSGlkZTtcblxuICAvKipcbiAgICogVGhlIG9yaWVudGF0aW9uIG9mIG5hdnMuXG4gICAqXG4gICAqIFVzaW5nIGB2ZXJ0aWNhbGAgd2lsbCBhbHNvIGFkZCB0aGUgYGFyaWEtb3JpZW50YXRpb25gIGF0dHJpYnV0ZVxuICAgKi9cbiAgQElucHV0KCkgb3JpZW50YXRpb246ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCc7XG5cbiAgLyoqXG4gICAqIFJvbGUgYXR0cmlidXRlIGdlbmVyYXRpbmcgc3RyYXRlZ3k6XG4gICAqIC0gYGZhbHNlYCAtIG5vIHJvbGUgYXR0cmlidXRlcyB3aWxsIGJlIGdlbmVyYXRlZFxuICAgKiAtIGAndGFibGlzdCdgIC0gJ3RhYmxpc3QnLCAndGFiJyBhbmQgJ3RhYnBhbmVsJyB3aWxsIGJlIGdlbmVyYXRlZCAoZGVmYXVsdClcbiAgICovXG4gIEBJbnB1dCgpIHJvbGVzOiAndGFibGlzdCcgfCBmYWxzZTtcblxuICBAQ29udGVudENoaWxkcmVuKE5nYk5hdkl0ZW0pIGl0ZW1zOiBRdWVyeUxpc3Q8TmdiTmF2SXRlbT47XG5cbiAgY29uc3RydWN0b3IoQEF0dHJpYnV0ZSgncm9sZScpIHB1YmxpYyByb2xlOiBzdHJpbmcsIGNvbmZpZzogTmdiTmF2Q29uZmlnLCBwcml2YXRlIF9jZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICB0aGlzLmRlc3Ryb3lPbkhpZGUgPSBjb25maWcuZGVzdHJveU9uSGlkZTtcbiAgICB0aGlzLm9yaWVudGF0aW9uID0gY29uZmlnLm9yaWVudGF0aW9uO1xuICAgIHRoaXMucm9sZXMgPSBjb25maWcucm9sZXM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG5hdiBjaGFuZ2UgZXZlbnQgZW1pdHRlZCByaWdodCBiZWZvcmUgdGhlIG5hdiBjaGFuZ2UgaGFwcGVucyBvbiB1c2VyIGNsaWNrLlxuICAgKlxuICAgKiBUaGlzIGV2ZW50IHdvbid0IGJlIGVtaXR0ZWQgaWYgbmF2IGlzIGNoYW5nZWQgcHJvZ3JhbW1hdGljYWxseSB2aWEgYFthY3RpdmVJZF1gIG9yIGAuc2VsZWN0KClgLlxuICAgKlxuICAgKiBTZWUgW2BOZ2JOYXZDaGFuZ2VFdmVudGBdKCMvY29tcG9uZW50cy9uYXYvYXBpI05nYk5hdkNoYW5nZUV2ZW50KSBmb3IgcGF5bG9hZCBkZXRhaWxzLlxuICAgKi9cbiAgQE91dHB1dCgpIG5hdkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiTmF2Q2hhbmdlRXZlbnQ+KCk7XG5cbiAgY2xpY2soaXRlbTogTmdiTmF2SXRlbSkge1xuICAgIGlmICghaXRlbS5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fdXBkYXRlQWN0aXZlSWQoaXRlbS5pZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbGVjdHMgdGhlIG5hdiB3aXRoIHRoZSBnaXZlbiBpZCBhbmQgc2hvd3MgaXRzIGFzc29jaWF0ZWQgcGFuZS5cbiAgICogQW55IG90aGVyIG5hdiB0aGF0IHdhcyBwcmV2aW91c2x5IHNlbGVjdGVkIGJlY29tZXMgdW5zZWxlY3RlZCBhbmQgaXRzIGFzc29jaWF0ZWQgcGFuZSBpcyBoaWRkZW4uXG4gICAqL1xuICBzZWxlY3QoaWQ6IGFueSkgeyB0aGlzLl91cGRhdGVBY3RpdmVJZChpZCwgZmFsc2UpOyB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIGlmICghaXNEZWZpbmVkKHRoaXMuYWN0aXZlSWQpKSB7XG4gICAgICBjb25zdCBuZXh0SWQgPSB0aGlzLml0ZW1zLmZpcnN0ID8gdGhpcy5pdGVtcy5maXJzdC5pZCA6IG51bGw7XG4gICAgICBpZiAoaXNWYWxpZE5hdklkKG5leHRJZCkpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlQWN0aXZlSWQobmV4dElkLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuX2NkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVBY3RpdmVJZChuZXh0SWQ6IGFueSwgZW1pdE5hdkNoYW5nZSA9IHRydWUpIHtcbiAgICBpZiAodGhpcy5hY3RpdmVJZCAhPT0gbmV4dElkKSB7XG4gICAgICBsZXQgZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoZW1pdE5hdkNoYW5nZSkge1xuICAgICAgICB0aGlzLm5hdkNoYW5nZS5lbWl0KHthY3RpdmVJZDogdGhpcy5hY3RpdmVJZCwgbmV4dElkLCBwcmV2ZW50RGVmYXVsdDogKCkgPT4geyBkZWZhdWx0UHJldmVudGVkID0gdHJ1ZTsgfX0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVJZCA9IG5leHRJZDtcbiAgICAgICAgdGhpcy5hY3RpdmVJZENoYW5nZS5lbWl0KG5leHRJZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0byBwdXQgb24gdGhlIG5hdiBsaW5rLlxuICpcbiAqIEBzaW5jZSA1LjIuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdhW25nYk5hdkxpbmtdJyxcbiAgaG9zdDoge1xuICAgICdbaWRdJzogJ25hdkl0ZW0uZG9tSWQnLFxuICAgICdbY2xhc3MubmF2LWxpbmtdJzogJ3RydWUnLFxuICAgICdbY2xhc3MubmF2LWl0ZW1dJzogJ2hhc05hdkl0ZW1DbGFzcygpJyxcbiAgICAnW2F0dHIucm9sZV0nOiBgcm9sZSA/IHJvbGUgOiBuYXYucm9sZXMgPyAndGFiJyA6IHVuZGVmaW5lZGAsXG4gICAgJ2hyZWYnOiAnJyxcbiAgICAnW2NsYXNzLmFjdGl2ZV0nOiAnbmF2SXRlbS5hY3RpdmUnLFxuICAgICdbY2xhc3MuZGlzYWJsZWRdJzogJ25hdkl0ZW0uZGlzYWJsZWQnLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnbmF2SXRlbS5kaXNhYmxlZCA/IC0xIDogdW5kZWZpbmVkJyxcbiAgICAnW2F0dHIuYXJpYS1jb250cm9sc10nOiAnbmF2SXRlbS5pc1BhbmVsSW5Eb20oKSA/IG5hdkl0ZW0ucGFuZWxEb21JZCA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLXNlbGVjdGVkXSc6ICduYXZJdGVtLmFjdGl2ZScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ25hdkl0ZW0uZGlzYWJsZWQnLFxuICAgICcoY2xpY2spJzogJ25hdi5jbGljayhuYXZJdGVtKTsgJGV2ZW50LnByZXZlbnREZWZhdWx0KCknXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTmdiTmF2TGluayB7XG4gIGNvbnN0cnVjdG9yKEBBdHRyaWJ1dGUoJ3JvbGUnKSBwdWJsaWMgcm9sZTogc3RyaW5nLCBwdWJsaWMgbmF2SXRlbTogTmdiTmF2SXRlbSwgcHVibGljIG5hdjogTmdiTmF2KSB7fVxuXG4gIGhhc05hdkl0ZW1DbGFzcygpIHtcbiAgICAvLyB3aXRoIGFsdGVybmF0aXZlIG1hcmt1cCB3ZSBoYXZlIHRvIGFkZCBgLm5hdi1pdGVtYCBjbGFzcywgYmVjYXVzZSBgbmdiTmF2SXRlbWAgaXMgb24gdGhlIG5nLWNvbnRhaW5lclxuICAgIHJldHVybiB0aGlzLm5hdkl0ZW0uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm5vZGVUeXBlID09PSBOb2RlLkNPTU1FTlRfTk9ERTtcbiAgfVxufVxuXG5cbi8qKlxuICogVGhlIHBheWxvYWQgb2YgdGhlIGNoYW5nZSBldmVudCBlbWl0dGVkIHJpZ2h0IGJlZm9yZSB0aGUgbmF2IGNoYW5nZSBoYXBwZW5zIG9uIHVzZXIgY2xpY2suXG4gKlxuICogVGhpcyBldmVudCB3b24ndCBiZSBlbWl0dGVkIGlmIG5hdiBpcyBjaGFuZ2VkIHByb2dyYW1tYXRpY2FsbHkgdmlhIGBbYWN0aXZlSWRdYCBvciBgLnNlbGVjdCgpYC5cbiAqXG4gKiBAc2luY2UgNS4yLjBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JOYXZDaGFuZ2VFdmVudCB7XG4gIC8qKlxuICAgKiBJZCBvZiB0aGUgY3VycmVudGx5IGFjdGl2ZSBuYXYuXG4gICAqL1xuICBhY3RpdmVJZDogYW55O1xuXG4gIC8qKlxuICAgKiBJZCBvZiB0aGUgbmV3bHkgc2VsZWN0ZWQgbmF2LlxuICAgKi9cbiAgbmV4dElkOiBhbnk7XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRoYXQgd2lsbCBwcmV2ZW50IG5hdiBjaGFuZ2UgaWYgY2FsbGVkLlxuICAgKi9cbiAgcHJldmVudERlZmF1bHQ6ICgpID0+IHZvaWQ7XG59XG4iXX0=