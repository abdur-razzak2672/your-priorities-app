var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import "../../common/yp-image.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import { SharedStyles } from "./SharedStyles.js";
import "@material/web/progress/circular-progress.js";
import './aoi-streaming-analysis.js';
let AoiSurveyAnalysis = class AoiSurveyAnalysis extends YpBaseElement {
    async connectedCallback() {
        super.connectedCallback();
        window.appGlobals.activity(`Analysis - open`);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.appGlobals.activity(`Analysis - close`);
    }
    renderStreamingAnalysis() {
        try {
            const analysis_config = JSON.parse(this.earl.configuration.analysis_config);
            return html ` ${analysis_config.analyses.map((analysis) => {
                return analysis.map((analysisTypeIndex) => {
                    return html `<aoi-streaming-analysis
            groupId=${this.groupId}
            analysisIndex=${analysis.analysisIndex}
            analysisTypeIndex=${analysisTypeIndex}
          >
          </aoi-streaming-analysis>`;
                });
            })}`;
        }
        catch (error) {
            console.error(error);
            return nothing;
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
    }
    static get styles() {
        return [
            ...super.styles,
            SharedStyles,
            css `
        .title {
          font-size: 22px;
          letter-spacing: 0.22em;
          line-height: 1.7;
          color: var(--md-sys-color-on-primary-container);
          background-color: var(--md-sys-color-primary-container);
          padding: 16px;
          margin-top: 32px;
          border-radius: 16px;
          margin-bottom: 8px;
        }

        .analysisTitle {
          font-size: 16px;
          margin: 16px;
          padding: 8px;
          margin-top: 8px;
          border-radius: 16px;
          text-align: center;
          color: var(--md-sys-color-secondary-container);
          background-color: var(--md-sys-color-on-secondary-container);
        }

        .ideasLabel {
          font-size: 16px;
          margin: 16px;
          padding: 8px;
          margin-bottom: 8px;
          width: 80%;
          border-radius: 16px;
          text-align: center;
          color: var(--md-sys-color-on-primary-container);
          background-color: var(--md-sys-color-primary-container);
        }

        .generatingInfo {
          font-size: 16px;
          margin-top: 8px;
          margin-bottom: 16px;
          font-style: italic;
        }

        .analysisResults {
          padding: 16px;
          padding-top: 0;
        }

        .rowsContainer {
          padding: 0;
          padding-top: 16px;
          padding-bottom: 16px;
          margin: 16px;
          width: 100%;
          margin-top: 8px;
          border-radius: 24px;
          margin-bottom: 16px;
          color: var(--md-sys-color-on-primary-container);
          background-color: var(--md-sys-color-primary-container);
        }

        .analysisContainer {
          padding: 8px;
          margin: 8px;
          color: var(--md-sys-color-primary);

          min-width: 350px;
          width: 550px;

          font-size: 16px;
          vertical-align: center;

          padding-bottom: 16px;
        }

        .analysisRow {
          margin-bottom: 16px;
          width: 100%;
        }

        .analysisRow {
          padding: 0px;
          margin: 0px;
          border-radius: 16px;
        }

        .column {
          padding: 8px;
        }

        .index {
          font-size: 16px;
        }

        .nickname {
          padding-bottom: 0;
        }

        .nameAndScore {
          width: 100%;
        }

        .analysisRow {
        }

        .answers {
          text-align: left;
          align-items: left;
          width: 100%;
        }

        .questionTitle {
        }

        @media (min-width: 960px) {
          .questionTitle {
            margin-bottom: 16px;
          }
        }

        @media (max-width: 960px) {
          .title {
            font-size: 18px;
            letter-spacing: 0.15em;
            line-height: 1.5;
            margin-top: 16px;
          }

          .row {
            min-width: 300px;
            width: 300px;
          }

          .analysisContainer {
            min-width: 100%;
            width: 100%;
            padding-left: 0;
            padding-right: 0;
            margin: 0;
          }

          .analysisResults {
            border-radius: 16px;
          }

          .analysisRow {
            width: 100%;
          }

          .ideaDescription {
            padding-right: 24px;
          }

          .ideaIndex {
            padding-left: 24px;
          }
        }
      `,
        ];
    }
    renderAnalysis() {
        let outHtml = html ``;
        if (this.earl.configuration &&
            this.earl.configuration.analysis_config?.analyses?.length > 0) {
            for (let i = 0; i < this.earl.configuration.analysis_config.analyses.length; i++) {
                const analysis = this.earl.configuration.analysis_config.analyses[i];
                outHtml = html `${outHtml}
          <div class="ideasLabel">${analysis.ideasLabel}</div>

         `;
                let innerHtml = html ``;
                for (let a = 0; a < analysis.analysisTypes.length; a++) {
                    innerHtml = html `${innerHtml}
          <aoi-streaming-analysis
            .groupId=${this.group.id}
            .analysisIndex=${i}
            .analysisTypeIndex=${a}
          >
          </aoi-streaming-analysis>`;
                }
                outHtml = html `${outHtml}
          <div class="rowsContainer">${innerHtml}</div>`;
            }
        }
        return outHtml;
    }
    render() {
        return html `
      <div class="topContainer layout vertical wrap center-center">
        <div class="title">${this.t("Vote Analysis")}</div>
        <div class="layout vertical self-start">
          <div class="questionTitle">${this.question.name}</div>
        </div>
        <div class="layout vertical center-center analysisContainer">
          ${this.renderAnalysis()}
        </div>
      </div>
    `;
    }
};
__decorate([
    property({ type: Number })
], AoiSurveyAnalysis.prototype, "groupId", void 0);
__decorate([
    property({ type: Object })
], AoiSurveyAnalysis.prototype, "group", void 0);
__decorate([
    property({ type: Object })
], AoiSurveyAnalysis.prototype, "question", void 0);
__decorate([
    property({ type: Object })
], AoiSurveyAnalysis.prototype, "earl", void 0);
AoiSurveyAnalysis = __decorate([
    customElement("aoi-survey-analysis")
], AoiSurveyAnalysis);
export { AoiSurveyAnalysis };
//# sourceMappingURL=aoi-survey-analysis.js.map