export enum AnalyticsCategory {
  DOCK = 'dock',
  WINDOW = 'window',
  NAVIGATION = 'navigation',
  INTERACTION = 'interaction',
  DOCUMENT = 'document',
  MENU = 'menu',
  TOP_BAR = 'top_bar',
  USER_ENGAGEMENT = 'user_engagement',
  SOURCE_CODE = 'source_code'
}

export enum AnalyticsAction {
  CLICK = 'click',
  OPEN = 'open',
  CLOSE = 'close',
  MINIMIZE = 'minimize',
  MAXIMIZE = 'maximize',
  DRAG = 'drag',
  DOWNLOAD = 'download',
  VIEW_START = 'view_start',
  VIEW_END = 'view_end',
  MENU_OPEN = 'menu_open',
  MENU_ITEM_SELECT = 'menu_item_select',
  WINDOW_ACTION = 'window_action',
  VIEW_SOURCE = 'view_source'
}

export enum AnalyticsLabel {
  // Dock labels
  HOME = 'home',
  ABOUT = 'about',
  RESUME = 'resume',
  PROJECTS = 'projects',
  CONTACT = 'contact',
  BLOG = 'blog',
  
  // Source code labels
  GITHUB_REPOSITORY = 'github_repository',
  
  // Menu labels
  FINDER = 'finder',
  CONTEXT_MENU = 'context_menu',
  
  // Window labels
  MAIN_WINDOW = 'main_window',
  MODAL = 'modal'
}

export interface AnalyticsEvent {
  category: AnalyticsCategory;
  action: AnalyticsAction;
  label?: AnalyticsLabel | string;
  value?: number;
}
