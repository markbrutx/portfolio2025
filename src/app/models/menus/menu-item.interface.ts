export interface MenuItem {
  label: string;
  action: () => void;
  divider?: boolean;
}
