import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import numberFormatter from '../../util/number-formatter';
import { PlausibleSourcesBase } from './pl-sources-base';

import * as url from '../../util/url.js';
import * as api from '../../api.js';

@customElement('pl-sources-all')
export class PlausibleSourcesAll extends PlausibleSourcesBase {
  @property({ type: String })
  to: string | undefined = undefined;

  static get styles() {
    return [...super.styles];
  }

  constructor() {
    super();
    this.state = { loading: true };
  }

  firstUpdated() {
    this.fetchReferrers();
    if (this.timer) this.timer.onTick(this.fetchReferrers.bind(this));
  }

  connectedCallback() {
    this.updateState({ loading: true, referrers: undefined });
    this.fetchReferrers();
  }

  fetchReferrers() {
    api
      .getWithProxy(
        this.collectionType,
        this.collectionId,
        `/api/stats/${encodeURIComponent(this.site!.domain!)}/sources`,
        this.query,
        { show_noref: this.showNoRef }
      )
      .then((res: PlausibleReferrerData[]) =>
        this.updateState({ loading: false, referrers: res })
      );
  }

  renderReferrer(referrer: PlausibleReferrerData) {
    const maxWidthDeduction = this.showConversionRate ? '10rem' : '5rem';

    return html`
      <div
        class="flex items-center justify-between my-1 text-sm"
        key=${referrer.name}
      >
        <pl-bar
          .count=${referrer.visitors}
          .all=${this.state.referrers}
          bg="bg-blue-50 dark:bg-gray-500 dark:bg-opacity-15"
          .maxWidthDeduction=${maxWidthDeduction}
        >
          <span
            class="flex px-2 py-1.5 dark:text-gray-300 relative z-9 break-all"
          >
            <pl-link
              class="md:truncate block hover:underline"
              .to=${url.setQuery('source', referrer.name)}
            >
              <img
                src=${`/favicon/sources/${encodeURIComponent(referrer.name)}`}
                class="inline w-4 h-4 mr-2 -mt-px align-middle"
              />
              ${referrer.name}
            </pl-link>
          </span>
        </pl-bar>
        <span
          class="font-medium dark:text-gray-200 w-20 text-right"
          tooltip="{referrer.visitors}"
          >${numberFormatter(referrer.visitors)}</span
        >
        ${this.showConversionRate
          ? html`<span class="font-medium dark:text-gray-200 w-20 text-right"
              >${referrer.conversion_rate}%</span
            >`
          : nothing}
      </div>
    `;
  }

  renderList() {
    if (this.state.referrers && this.state.referrers.length > 0) {
      return html`
        <div
          class="flex items-center justify-between mt-3 mb-2 text-xs font-bold tracking-wide text-gray-500"
        >
          <span>Source</span>
          <div class="text-right">
            <span class="inline-block w-20">${this.label}</span>
            ${this.showConversionRate
              ? html`<span class="inline-block w-20">CR</span>`
              : nothing}
          </div>
        </div>

        <div class="flex-grow">
          ${this.state.referrers.map(r => this.renderReferrer(r))}
        </div>
        <pl-more-link
          .site=${this.site}
          .list=${this.state.referrers}
          endpoint="sources"
        ></pl-more-link>
      `;
    } else {
      return html`
        <div class="font-medium text-center text-gray-500 mt-44">
          No data yet
        </div>
      `;
    }
  }

  renderContent() {
    html`
      <div class="flex flex-col flex-grow">
        <div id="sources" class="flex justify-between w-full">
          <h3 class="font-bold dark:text-gray-100">Top Sources</h3>
          ${this.renderTabs()}
        </div>
        ${this.state.loading
          ? html`<div class="mx-auto loading mt-44">
              <div></div>
            </div>`
          : nothing}
        <FadeIn show="{!this.state.loading}" class="flex flex-col flex-grow">
          {this.renderList()}
        </FadeIn>
      </div>
    `;
  }

  render() {
    return html`
      <div
        class="relative p-4 bg-white rounded shadow-xl stats-item flex flex-col mt-6 w-full dark:bg-gray-825"
      >
        ${this.renderContent()}
      </div>
    `;
  }
}
