import type { Schema, Struct } from '@strapi/strapi';

export interface BasicTextLinkPair extends Struct.ComponentSchema {
  collectionName: 'components_basic_text_link_pairs';
  info: {
    displayName: 'Text Link Pair';
  };
  attributes: {
    text: Schema.Attribute.Text;
    url: Schema.Attribute.Text;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'basic.text-link-pair': BasicTextLinkPair;
    }
  }
}
