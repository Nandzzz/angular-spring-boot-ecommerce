import { __decorate, __param } from "tslib";
import { AfterContentChecked, AfterContentInit, Attribute, ChangeDetectorRef, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, OnInit, Output, QueryList, TemplateRef } from '@angular/core';
import { isDefined } from '../util/util';
import { NgbNavConfig } from './nav-config';
const isValidNavId = (id) => isDefined(id) && id !== '';
const ɵ0 = isValidNavId;
let navCounter = 0;
/**
 * This directive must be used to wrap content to be displayed in the nav.
 *
 * @since 5.2.0
 */
let NgbNavContent = class NgbNavContent {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
};
NgbNavContent.ctorParameters = () => [
    { type: TemplateRef }
];
NgbNavContent = __decorate([
    Directive({ selector: 'ng-template[ngbNavContent]' })
], NgbNavContent);
export { NgbNavContent };
/**
 * The directive used to group nav link and related nav content. As well as set nav identifier and some options.
 *
 * @since 5.2.0
 */
let NgbNavItem = class NgbNavItem {
    constructor(nav, elementRef) {
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
    ngAfterContentChecked() {
        // We are using @ContentChildren instead of @ContentChild as in the Angular version being used
        // only @ContentChildren allows us to specify the {descendants: false} option.
        // Without {descendants: false} we are hitting bugs described in:
        // https://github.com/ng-bootstrap/ng-bootstrap/issues/2240
        this.contentTpl = this.contentTpls.first;
    }
    ngOnInit() {
        if (!isDefined(this.domId)) {
            this.domId = `ngb-nav-${navCounter++}`;
        }
    }
    get active() { return this._nav.activeId === this.id; }
    get id() { return isValidNavId(this._id) ? this._id : this.domId; }
    get panelDomId() { return `${this.domId}-panel`; }
    isPanelInDom() {
        return (isDefined(this.destroyOnHide) ? !this.destroyOnHide : !this._nav.destroyOnHide) || this.active;
    }
};
NgbNavItem.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => NgbNav),] }] },
    { type: ElementRef }
];
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
    __param(0, Inject(forwardRef(() => NgbNav)))
], NgbNavItem);
export { NgbNavItem };
/**
 * A nav directive that helps with implementing tabbed navigation components.
 *
 * @since 5.2.0
 */
let NgbNav = class NgbNav {
    constructor(role, config, _cd) {
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
    click(item) {
        if (!item.disabled) {
            this._updateActiveId(item.id);
        }
    }
    /**
     * Selects the nav with the given id and shows its associated pane.
     * Any other nav that was previously selected becomes unselected and its associated pane is hidden.
     */
    select(id) { this._updateActiveId(id, false); }
    ngAfterContentInit() {
        if (!isDefined(this.activeId)) {
            const nextId = this.items.first ? this.items.first.id : null;
            if (isValidNavId(nextId)) {
                this._updateActiveId(nextId, false);
                this._cd.detectChanges();
            }
        }
    }
    _updateActiveId(nextId, emitNavChange = true) {
        if (this.activeId !== nextId) {
            let defaultPrevented = false;
            if (emitNavChange) {
                this.navChange.emit({ activeId: this.activeId, nextId, preventDefault: () => { defaultPrevented = true; } });
            }
            if (!defaultPrevented) {
                this.activeId = nextId;
                this.activeIdChange.emit(nextId);
            }
        }
    }
};
NgbNav.ctorParameters = () => [
    { type: String, decorators: [{ type: Attribute, args: ['role',] }] },
    { type: NgbNavConfig },
    { type: ChangeDetectorRef }
];
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
            '[class.flex-column]': `orientation === 'vertical'`,
            '[attr.aria-orientation]': `orientation === 'vertical' && roles === 'tablist' ? 'vertical' : undefined`,
            '[attr.role]': `role ? role : roles ? 'tablist' : undefined`,
        }
    }),
    __param(0, Attribute('role'))
], NgbNav);
export { NgbNav };
/**
 * A directive to put on the nav link.
 *
 * @since 5.2.0
 */
let NgbNavLink = class NgbNavLink {
    constructor(role, navItem, nav) {
        this.role = role;
        this.navItem = navItem;
        this.nav = nav;
    }
    hasNavItemClass() {
        // with alternative markup we have to add `.nav-item` class, because `ngbNavItem` is on the ng-container
        return this.navItem.elementRef.nativeElement.nodeType === Node.COMMENT_NODE;
    }
};
NgbNavLink.ctorParameters = () => [
    { type: String, decorators: [{ type: Attribute, args: ['role',] }] },
    { type: NgbNavItem },
    { type: NgbNav }
];
NgbNavLink = __decorate([
    Directive({
        selector: 'a[ngbNavLink]',
        host: {
            '[id]': 'navItem.domId',
            '[class.nav-link]': 'true',
            '[class.nav-item]': 'hasNavItemClass()',
            '[attr.role]': `role ? role : nav.roles ? 'tab' : undefined`,
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
export { NgbNavLink };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvIiwic291cmNlcyI6WyJuYXYvbmF2LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsbUJBQW1CLEVBQ25CLGdCQUFnQixFQUNoQixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBQ04sTUFBTSxFQUNOLFNBQVMsRUFDVCxXQUFXLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRTFDLE1BQU0sWUFBWSxHQUFHLENBQUMsRUFBTyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQzs7QUFFN0QsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBaUJuQjs7OztHQUlHO0FBRUgsSUFBYSxhQUFhLEdBQTFCLE1BQWEsYUFBYTtJQUN4QixZQUFtQixXQUE2QjtRQUE3QixnQkFBVyxHQUFYLFdBQVcsQ0FBa0I7SUFBRyxDQUFDO0NBQ3JELENBQUE7O1lBRGlDLFdBQVc7O0FBRGhDLGFBQWE7SUFEekIsU0FBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLDRCQUE0QixFQUFDLENBQUM7R0FDdkMsYUFBYSxDQUV6QjtTQUZZLGFBQWE7QUFLMUI7Ozs7R0FJRztBQUVILElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVU7SUFxQ3JCLFlBQThDLEdBQUcsRUFBUyxVQUEyQjtRQUEzQixlQUFVLEdBQVYsVUFBVSxDQUFpQjtRQTVCckY7Ozs7V0FJRztRQUNNLGFBQVEsR0FBRyxLQUFLLENBQUM7UUF3QnhCLDJEQUEyRDtRQUMzRCxJQUFJLENB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WUFDdkMsYUFBYSxFQUFFLDZDQUE2QztZQUM1RCxNQUFNLEVBQUUsRUFBRTtZQUNWLGdCQUFnQixFQUFFLGdCQUFnQjtZQUNsQyxrQkFBa0IsRUFBRSxrQkFBa0I7WUFDdEMsaUJBQWlCLEVBQUUsbUNBQW1DO1lBQ3RELHNCQUFzQixFQUFFLG9EQUFvRDtZQUM1RSxzQkFBc0IsRUFBRSxnQkFBZ0I7WUFDeEMsc0JBQXNCLEVBQUUsa0JBQWtCO1lBQzFDLFNBQVMsRUFBRSw2Q0FBNkM7U0FDekQ7S0FDRixDQUFDO0lBRWEsV0FBQSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7R0FEbkIsVUFBVSxDQU90QjtTQVBZLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBUZW1wbGF0ZVJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7aXNEZWZpbmVkfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtOZ2JOYXZDb25maWd9IGZyb20gJy4vbmF2LWNvbmZpZyc7XG5cbmNvbnN0IGlzVmFsaWROYXZJZCA9IChpZDogYW55KSA9PiBpc0RlZmluZWQoaWQpICYmIGlkICE9PSAnJztcblxubGV0IG5hdkNvdW50ZXIgPSAwO1xuXG4vKipcbiAqIENvbnRleHQgcGFzc2VkIHRvIHRoZSBuYXYgY29udGVudCB0ZW1wbGF0ZS5cbiAqXG4gKiBTZWUgW3RoaXMgZGVtb10oIy9jb21wb25lbnRzL25hdi9leGFtcGxlcyNrZWVwLWNvbnRlbnQpIGFzIHRoZSBleGFtcGxlLlxuICpcbiAqIEBzaW5jZSA1LjIuMFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYk5hdkNvbnRlbnRDb250ZXh0IHtcbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgY3VycmVudCBuYXYgY29udGVudCBpcyB2aXNpYmxlIGFuZCBhY3RpdmVcbiAgICovXG4gICRpbXBsaWNpdDogYm9vbGVhbjtcbn1cblxuXG4vKipcbiAqIFRoaXMgZGlyZWN0aXZlIG11c3QgYmUgdXNlZCB0byB3cmFwIGNvbnRlbnQgdG8gYmUgZGlzcGxheWVkIGluIHRoZSBuYXYuXG4gKlxuICogQHNpbmNlIDUuMi4wXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbmctdGVtcGxhdGVbbmdiTmF2Q29udGVudF0nfSlcbmV4cG9ydCBjbGFzcyBOZ2JOYXZDb250ZW50IHtcbiAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+KSB7fVxufVxuXG5cbi8qKlxuICogVGhlIGRpcmVjdGl2ZSB1c2VkIHRvIGdyb3VwIG5hdiBsaW5rIGFuZCByZWxhdGVkIG5hdiBjb250ZW50LiBBcyB3ZWxsIGFzIHNldCBuYXYgaWRlbnRpZmllciBhbmQgc29tZSBvcHRpb25zLlxuICpcbiAqIEBzaW5jZSA1LjIuMFxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tuZ2JOYXZJdGVtXScsIGV4cG9ydEFzOiAnbmdiTmF2SXRlbScsIGhvc3Q6IHsnW2NsYXNzLm5hdi1pdGVtXSc6ICd0cnVlJ319KVxuZXhwb3J0IGNsYXNzIE5nYk5hdkl0ZW0gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRDaGVja2VkLCBPbkluaXQge1xuICBwcml2YXRlIF9uYXY6IE5nYk5hdjtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCBub24tYWN0aXZlIGN1cnJlbnQgbmF2IGl0ZW0gY29udGVudCB3aWxsIGJlIHJlbW92ZWQgZnJvbSBET01cbiAgICogT3RoZXJ3aXNlIGl0IHdpbGwganVzdCBiZSBoaWRkZW5cbiAgICovXG4gIEBJbnB1dCgpIGRlc3Ryb3lPbkhpZGU7XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgdGhlIGN1cnJlbnQgbmF2IGl0ZW0gaXMgZGlzYWJsZWQgYW5kIGNhbid0IGJlIHRvZ2dsZWQgYnkgdXNlci5cbiAgICpcbiAgICogTmV2ZXJ0aGVsZXNzIGRpc2FibGVkIG5hdiBjYW4gYmUgc2VsZWN0ZWQgcHJvZ3JhbW1hdGljYWxseSB2aWEgdGhlIGAuc2VsZWN0KClgIG1ldGhvZCBhbmQgdGhlIGBbYWN0aXZlSWRdYCBiaW5kaW5nLlxuICAgKi9cbiAgQElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIGlkIHVzZWQgZm9yIHRoZSBET00gZWxlbWVudHMuXG4gICAqIE11c3QgYmUgdW5pcXVlIGluc2lkZSB0aGUgZG9jdW1lbnQgaW4gY2FzZSB5b3UgaGF2ZSBtdWx0aXBsZSBgbmdiTmF2YHMgb24gdGhlIHBhZ2UuXG4gICAqXG4gICAqIEF1dG9nZW5lcmF0ZWQgYXMgYG5nYi1uYXYtWFhYYCBpZiBub3QgcHJvdmlkZWQuXG4gICAqL1xuICBASW5wdXQoKSBkb21JZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaWQgdXNlZCBhcyBhIG1vZGVsIGZvciBhY3RpdmUgbmF2LlxuICAgKiBJdCBjYW4gYmUgYW55dGhpbmcsIGJ1dCBtdXN0IGJlIHVuaXF1ZSBpbnNpZGUgb25lIGBuZ2JOYXZgLlxuICAgKlxuICAgKiBUaGUgb25seSBsaW1pdGF0aW9uIGlzIHRoYXQgaXQgaXMgbm90IHBvc3NpYmxlIHRvIGhhdmUgdGhlIGAnJ2AgKGVtcHR5IHN0cmluZykgYXMgaWQsXG4gICAqIGJlY2F1c2UgYCBuZ2JOYXZJdGVtIGAsIGBuZ2JOYXZJdGVtPScnYCBhbmQgYFtuZ2JOYXZJdGVtXT1cIicnXCJgIGFyZSBpbmRpc3Rpbmd1aXNoYWJsZVxuICAgKi9cbiAgQElucHV0KCduZ2JOYXZJdGVtJykgX2lkOiBhbnk7XG5cbiAgY29udGVudFRwbDogTmdiTmF2Q29udGVudCB8IG51bGw7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihOZ2JOYXZDb250ZW50LCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgY29udGVudFRwbHM6IFF1ZXJ5TGlzdDxOZ2JOYXZDb250ZW50PjtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTmdiTmF2KSkgbmF2LCBwdWJsaWMgZWxlbWVudFJlZjogRWxlbWVudFJlZjxhbnk+KSB7XG4gICAgLy8gVE9ETzogY2YgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMzAxMDZcbiAgICB0aGlzLl9uYXYgPSBuYXY7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgLy8gV2UgYXJlIHVzaW5nIEBDb250ZW50Q2hpbGRyZW4gaW5zdGVhZCBvZiBAQ29udGVudENoaWxkIGFzIGluIHRoZSBBbmd1bGFyIHZlcnNpb24gYmVpbmcgdXNlZFxuICAgIC8vIG9ubHkgQENvbnRlbnRDaGlsZHJlbiBhbGxvd3MgdXMgdG8gc3BlY2lmeSB0aGUge2Rlc2NlbmRhbnRzOiBmYWxzZX0gb3B0aW9uLlxuICAgIC8vIFdpdGhvdXQge2Rlc2NlbmRhbnRzOiBmYWxzZX0gd2UgYXJlIGhpdHRpbmcgYnVncyBkZXNjcmliZWQgaW46XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL25nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvaXNzdWVzLzIyNDBcbiAgICB0aGlzLmNvbnRlbnRUcGwgPSB0aGlzLmNvbnRlbnRUcGxzLmZpcnN0O1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCFpc0RlZmluZWQodGhpcy5kb21JZCkpIHtcbiAgICAgIHRoaXMuZG9tSWQgPSBgbmdiLW5hdi0ke25hdkNvdW50ZXIrK31gO1xuICAgIH1cbiAgfVxuXG4gIGdldCBhY3RpdmUoKSB7IHJldHVybiB0aGlzLl9uYXYuYWN0aXZlSWQgPT09IHRoaXMuaWQ7IH1cblxuICBnZXQgaWQoKSB7IHJldHVybiBpc1ZhbGlkTmF2SWQodGhpcy5faWQpID8gdGhpcy5faWQgOiB0aGlzLmRvbUlkOyB9XG5cbiAgZ2V0IHBhbmVsRG9tSWQoKSB7IHJldHVybiBgJHt0aGlzLmRvbUlkfS1wYW5lbGA7IH1cblxuICBpc1BhbmVsSW5Eb20oKSB7XG4gICAgcmV0dXJuIChpc0RlZmluZWQodGhpcy5kZXN0cm95T25IaWRlKSA/ICF0aGlzLmRlc3Ryb3lPbkhpZGUgOiAhdGhpcy5fbmF2LmRlc3Ryb3lPbkhpZGUpIHx8IHRoaXMuYWN0aXZlO1xuICB9XG59XG5cblxuLyoqXG4gKiBBIG5hdiBkaXJlY3RpdmUgdGhhdCBoZWxwcyB3aXRoIGltcGxlbWVudGluZyB0YWJiZWQgbmF2aWdhdGlvbiBjb21wb25lbnRzLlxuICpcbiAqIEBzaW5jZSA1LjIuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdiTmF2XScsXG4gIGV4cG9ydEFzOiAnbmdiTmF2JyxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MubmF2XSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLmZsZXgtY29sdW1uXSc6IGBvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJ2AsXG4gICAgJ1thdHRyLmFyaWEtb3JpZW50YXRpb25dJzogYG9yaWVudGF0aW9uID09PSAndmVydGljYWwnICYmIHJvbGVzID09PSAndGFibGlzdCcgPyAndmVydGljYWwnIDogdW5kZWZpbmVkYCxcbiAgICAnW2F0dHIucm9sZV0nOiBgcm9sZSA/IHJvbGUgOiByb2xlcyA/ICd0YWJsaXN0JyA6IHVuZGVmaW5lZGAsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTmdiTmF2IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vcmllbnRhdGlvbjogc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcm9sZXM6IGJvb2xlYW4gfCBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBpZCBvZiB0aGUgbmF2IHRoYXQgc2hvdWxkIGJlIGFjdGl2ZVxuICAgKlxuICAgKiBZb3UgY291bGQgYWxzbyB1c2UgdGhlIGAuc2VsZWN0KClgIG1ldGhvZCBhbmQgdGhlIGAobmF2Q2hhbmdlKWAgZXZlbnRcbiAgICovXG4gIEBJbnB1dCgpIGFjdGl2ZUlkOiBhbnk7XG5cbiAgLyoqXG4gICAqIFRoZSBldmVudCBlbWl0dGVkIGFmdGVyIHRoZSBhY3RpdmUgbmF2IGNoYW5nZXNcbiAgICogVGhlIHBheWxvYWQgb2YgdGhlIGV2ZW50IGlzIHRoZSBuZXdseSBhY3RpdmUgbmF2IGlkXG4gICAqXG4gICAqIElmIHlvdSB3YW50IHRvIHByZXZlbnQgbmF2IGNoYW5nZSwgeW91IHNob3VsZCB1c2UgYChuYXZDaGFuZ2UpYCBldmVudFxuICAgKi9cbiAgQE91dHB1dCgpIGFjdGl2ZUlkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgbm9uLWFjdGl2ZSBuYXYgY29udGVudCB3aWxsIGJlIHJlbW92ZWQgZnJvbSBET01cbiAgICogT3RoZXJ3aXNlIGl0IHdpbGwganVzdCBiZSBoaWRkZW5cbiAgICovXG4gIEBJbnB1dCgpIGRlc3Ryb3lPbkhpZGU7XG5cbiAgLyoqXG4gICAqIFRoZSBvcmllbnRhdGlvbiBvZiBuYXZzLlxuICAgKlxuICAgKiBVc2luZyBgdmVydGljYWxgIHdpbGwgYWxzbyBhZGQgdGhlIGBhcmlhLW9yaWVudGF0aW9uYCBhdHRyaWJ1dGVcbiAgICovXG4gIEBJbnB1dCgpIG9yaWVudGF0aW9uOiAnaG9yaXpvbnRhbCcgfCAndmVydGljYWwnO1xuXG4gIC8qKlxuICAgKiBSb2xlIGF0dHJpYnV0ZSBnZW5lcmF0aW5nIHN0cmF0ZWd5OlxuICAgKiAtIGBmYWxzZWAgLSBubyByb2xlIGF0dHJpYnV0ZXMgd2lsbCBiZSBnZW5lcmF0ZWRcbiAgICogLSBgJ3RhYmxpc3QnYCAtICd0YWJsaXN0JywgJ3RhYicgYW5kICd0YWJwYW5lbCcgd2lsbCBiZSBnZW5lcmF0ZWQgKGRlZmF1bHQpXG4gICAqL1xuICBASW5wdXQoKSByb2xlczogJ3RhYmxpc3QnIHwgZmFsc2U7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihOZ2JOYXZJdGVtKSBpdGVtczogUXVlcnlMaXN0PE5nYk5hdkl0ZW0+O1xuXG4gIGNvbnN0cnVjdG9yKEBBdHRyaWJ1dGUoJ3JvbGUnKSBwdWJsaWMgcm9sZTogc3RyaW5nLCBjb25maWc6IE5nYk5hdkNvbmZpZywgcHJpdmF0ZSBfY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgdGhpcy5kZXN0cm95T25IaWRlID0gY29uZmlnLmRlc3Ryb3lPbkhpZGU7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IGNvbmZpZy5vcmllbnRhdGlvbjtcbiAgICB0aGlzLnJvbGVzID0gY29uZmlnLnJvbGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBuYXYgY2hhbmdlIGV2ZW50IGVtaXR0ZWQgcmlnaHQgYmVmb3JlIHRoZSBuYXYgY2hhbmdlIGhhcHBlbnMgb24gdXNlciBjbGljay5cbiAgICpcbiAgICogVGhpcyBldmVudCB3b24ndCBiZSBlbWl0dGVkIGlmIG5hdiBpcyBjaGFuZ2VkIHByb2dyYW1tYXRpY2FsbHkgdmlhIGBbYWN0aXZlSWRdYCBvciBgLnNlbGVjdCgpYC5cbiAgICpcbiAgICogU2VlIFtgTmdiTmF2Q2hhbmdlRXZlbnRgXSgjL2NvbXBvbmVudHMvbmF2L2FwaSNOZ2JOYXZDaGFuZ2VFdmVudCkgZm9yIHBheWxvYWQgZGV0YWlscy5cbiAgICovXG4gIEBPdXRwdXQoKSBuYXZDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYk5hdkNoYW5nZUV2ZW50PigpO1xuXG4gIGNsaWNrKGl0ZW06IE5nYk5hdkl0ZW0pIHtcbiAgICBpZiAoIWl0ZW0uZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUFjdGl2ZUlkKGl0ZW0uaWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIHRoZSBuYXYgd2l0aCB0aGUgZ2l2ZW4gaWQgYW5kIHNob3dzIGl0cyBhc3NvY2lhdGVkIHBhbmUuXG4gICAqIEFueSBvdGhlciBuYXYgdGhhdCB3YXMgcHJldmlvdXNseSBzZWxlY3RlZCBiZWNvbWVzIHVuc2VsZWN0ZWQgYW5kIGl0cyBhc3NvY2lhdGVkIHBhbmUgaXMgaGlkZGVuLlxuICAgKi9cbiAgc2VsZWN0KGlkOiBhbnkpIHsgdGhpcy5fdXBkYXRlQWN0aXZlSWQoaWQsIGZhbHNlKTsgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAoIWlzRGVmaW5lZCh0aGlzLmFjdGl2ZUlkKSkge1xuICAgICAgY29uc3QgbmV4dElkID0gdGhpcy5pdGVtcy5maXJzdCA/IHRoaXMuaXRlbXMuZmlyc3QuaWQgOiBudWxsO1xuICAgICAgaWYgKGlzVmFsaWROYXZJZChuZXh0SWQpKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUFjdGl2ZUlkKG5leHRJZCwgZmFsc2UpO1xuICAgICAgICB0aGlzLl9jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlQWN0aXZlSWQobmV4dElkOiBhbnksIGVtaXROYXZDaGFuZ2UgPSB0cnVlKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlSWQgIT09IG5leHRJZCkge1xuICAgICAgbGV0IGRlZmF1bHRQcmV2ZW50ZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKGVtaXROYXZDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5uYXZDaGFuZ2UuZW1pdCh7YWN0aXZlSWQ6IHRoaXMuYWN0aXZlSWQsIG5leHRJZCwgcHJldmVudERlZmF1bHQ6ICgpID0+IHsgZGVmYXVsdFByZXZlbnRlZCA9IHRydWU7IH19KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlSWQgPSBuZXh0SWQ7XG4gICAgICAgIHRoaXMuYWN0aXZlSWRDaGFuZ2UuZW1pdChuZXh0SWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gcHV0IG9uIHRoZSBuYXYgbGluay5cbiAqXG4gKiBAc2luY2UgNS4yLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnYVtuZ2JOYXZMaW5rXScsXG4gIGhvc3Q6IHtcbiAgICAnW2lkXSc6ICduYXZJdGVtLmRvbUlkJyxcbiAgICAnW2NsYXNzLm5hdi1saW5rXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLm5hdi1pdGVtXSc6ICdoYXNOYXZJdGVtQ2xhc3MoKScsXG4gICAgJ1thdHRyLnJvbGVdJzogYHJvbGUgPyByb2xlIDogbmF2LnJvbGVzID8gJ3RhYicgOiB1bmRlZmluZWRgLFxuICAgICdocmVmJzogJycsXG4gICAgJ1tjbGFzcy5hY3RpdmVdJzogJ25hdkl0ZW0uYWN0aXZlJyxcbiAgICAnW2NsYXNzLmRpc2FibGVkXSc6ICduYXZJdGVtLmRpc2FibGVkJyxcbiAgICAnW2F0dHIudGFiaW5kZXhdJzogJ25hdkl0ZW0uZGlzYWJsZWQgPyAtMSA6IHVuZGVmaW5lZCcsXG4gICAgJ1thdHRyLmFyaWEtY29udHJvbHNdJzogJ25hdkl0ZW0uaXNQYW5lbEluRG9tKCkgPyBuYXZJdGVtLnBhbmVsRG9tSWQgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1zZWxlY3RlZF0nOiAnbmF2SXRlbS5hY3RpdmUnLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICduYXZJdGVtLmRpc2FibGVkJyxcbiAgICAnKGNsaWNrKSc6ICduYXYuY2xpY2sobmF2SXRlbSk7ICRldmVudC5wcmV2ZW50RGVmYXVsdCgpJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE5nYk5hdkxpbmsge1xuICBjb25zdHJ1Y3RvcihAQXR0cmlidXRlKCdyb2xlJykgcHVibGljIHJvbGU6IHN0cmluZywgcHVibGljIG5hdkl0ZW06IE5nYk5hdkl0ZW0sIHB1YmxpYyBuYXY6IE5nYk5hdikge31cblxuICBoYXNOYXZJdGVtQ2xhc3MoKSB7XG4gICAgLy8gd2l0aCBhbHRlcm5hdGl2ZSBtYXJrdXAgd2UgaGF2ZSB0byBhZGQgYC5uYXYtaXRlbWAgY2xhc3MsIGJlY2F1c2UgYG5nYk5hdkl0ZW1gIGlzIG9uIHRoZSBuZy1jb250YWluZXJcbiAgICByZXR1cm4gdGhpcy5uYXZJdGVtLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5ub2RlVHlwZSA9PT0gTm9kZS5DT01NRU5UX05PREU7XG4gIH1cbn1cblxuXG4vKipcbiAqIFRoZSBwYXlsb2FkIG9mIHRoZSBjaGFuZ2UgZXZlbnQgZW1pdHRlZCByaWdodCBiZWZvcmUgdGhlIG5hdiBjaGFuZ2UgaGFwcGVucyBvbiB1c2VyIGNsaWNrLlxuICpcbiAqIFRoaXMgZXZlbnQgd29uJ3QgYmUgZW1pdHRlZCBpZiBuYXYgaXMgY2hhbmdlZCBwcm9ncmFtbWF0aWNhbGx5IHZpYSBgW2FjdGl2ZUlkXWAgb3IgYC5zZWxlY3QoKWAuXG4gKlxuICogQHNpbmNlIDUuMi4wXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdiTmF2Q2hhbmdlRXZlbnQge1xuICAvKipcbiAgICogSWQgb2YgdGhlIGN1cnJlbnRseSBhY3RpdmUgbmF2LlxuICAgKi9cbiAgYWN0aXZlSWQ6IGFueTtcblxuICAvKipcbiAgICogSWQgb2YgdGhlIG5ld2x5IHNlbGVjdGVkIG5hdi5cbiAgICovXG4gIG5leHRJZDogYW55O1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0aGF0IHdpbGwgcHJldmVudCBuYXYgY2hhbmdlIGlmIGNhbGxlZC5cbiAgICovXG4gIHByZXZlbnREZWZhdWx0OiAoKSA9PiB2b2lkO1xufVxuIl19