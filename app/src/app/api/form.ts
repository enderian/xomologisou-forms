export interface Form {
  enabled: boolean;
  title: string;
  subtitle: string;
  terms: string;
  secret_prompt: string;
  image_prompt: string;
  sent_message: string;
  background_url: string;
  dark: boolean;
  custom_css: string;
  option_sets: Map<string, FormOptionSet>;
  accepts_image: boolean;
}

export interface FormOptionSet {
  name: string;
  options: Map<string, string>;
  allow_custom: boolean;
}

export interface FormAdvert {
  google?: boolean;
  image?: string;
  link?: string;
  height?: number;
  width?: number;
  element_id?: string;
  element_classes?: string;
}

export interface FormResponse {
  form?: Form;
  adverts?: Map<string, FormAdvert>;
  facebook_id?: string;
  facebook_name?: string;
  captcha?: string;
  error?: any;
}
