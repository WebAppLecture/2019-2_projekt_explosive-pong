let canvas = document.querySelector("#maincanvas");

export const BACKGROUND_COLOR = "#000000";
export const RESET_KEY_CODE = 13;
export const XBOOST_BALL_KEY_CODE = 66;
export const MIN_NUM_TARGETS_KEY_CODE = 49;//this constant refers directly to the number key corresponding with its function. Do not change.
export const MAX_NUM_TARGETS_KEY_CODE = 57;//this constant refers directly to the number key corresponding with its function. Do not change.

export const BALL_DEFAULT_SPEED = 11;
export const BALL_SPEED_REDUCTION = 0.1;
export const BALL_MAX_SPEED = 20;
export const BALL_DEFAULT_STRENGTH = 1;
export const BALL_WIDTH = 30;
export const BALL_HEIGHT = 30;
export const BALL_RADIUS = 18;
export const BALL_COLOR = "#FFFFFF";
export const BALL_STRONGER_COLOR = "#ffe436";
export const BALL_IGNITED_COLOR = "#FF5555";
export const BALL_FLASHING_INTERVALS = 120;
export const BALL_FLASHES_FASTER = 180;
export const BALL_FASTER_FLASHING_INTERVALS = 30;
export const BALL_STARTING_X = canvas.width / 2;
export const BALL_STARTING_Y = canvas.height / 2;

export const PLAYER_HEIGHT = 80;//100;
export const PLAYER_WIDTH = 30;
export const PLAYER_SPEED = 10;
export const PLAYER_COLOR = "#FFFFFF";
export const PLAYER_DISTANCE_FROM_BORDER = 300;
export const PLAYER_ACCELERATION = 1.5;
export const PLAYER_DECELERATION = 2;
export const PLAYER_MIN_SPEED = 7;


export const PLAYER_1_KEY_UP = 87;
export const PLAYER_1_KEY_DOWN = 83;
export const PLAYER_1_X =  + PLAYER_DISTANCE_FROM_BORDER-PLAYER_WIDTH / 2;
export const PLAYER_1_STARTING_Y = (canvas.height-PLAYER_HEIGHT) / 2;
export const PLAYER_2_KEY_UP = 79;
export const PLAYER_2_KEY_DOWN = 76;
export const PLAYER_2_X = canvas.width-PLAYER_DISTANCE_FROM_BORDER-PLAYER_WIDTH / 2;
export const PLAYER_2_STARTING_Y = (canvas.height-PLAYER_HEIGHT) / 2;

export const NUM_TARGETS = 4;
export const TARGET_WIDTH = 20;
export const TARGET_HEIGHT = 20;
export const TARGET_BORDER_WIDTH = 3;
export const TARGET_COLOR_INVINCIBLE = "#4444FF";
export const TARGET_COLOR1 = "#FFFFFF";
export const TARGET_COLOR2 = "#ffdf40";
export const TARGET_COLOR3 = "#ff9040";
export const TARGET_COLOR4 = "#ff2626";
export const TARGET_COLOR5 = "#212121";
export const TARGET_DISTANCE_FROM_BORDER = 150;
export const P1_TARGET_X = TARGET_DISTANCE_FROM_BORDER - TARGET_WIDTH / 2;
export const P2_TARGET_X = canvas.width - TARGET_DISTANCE_FROM_BORDER - TARGET_WIDTH / 2;
export const TARGET_HEALTH = 4;
export const TARGET_I_FRAMES = 60;

export const EFFECT_AREA_ERROR_MARGIN = 5;
export const EFFECT_AREA_RADII = [30, 30, 30, 40, 30];
export const EFFECT_AREA_DISTANCE_TO_PLAYER = 75;
export const EFFECT_AREA_DISTANCE_TO_BORDER = 60;
export const EFFECT_AREA_DISTANCE_TO_BALL = 200;
export const EFFECT_AREA_MIN_X = PLAYER_1_X + EFFECT_AREA_DISTANCE_TO_PLAYER + PLAYER_WIDTH;
export const EFFECT_AREA_MAX_X = PLAYER_2_X - EFFECT_AREA_DISTANCE_TO_PLAYER + PLAYER_WIDTH;
export const EFFECT_AREA_MIN_Y = 0 + EFFECT_AREA_DISTANCE_TO_BORDER;
export const EFFECT_AREA_MAX_Y = canvas.height - EFFECT_AREA_DISTANCE_TO_BORDER;
export const EFFECT_AREA_BORDER_WIDTH = 5;

export const EFFECT_AREA_CHANGE_TIME = 600;

const EFFECT_ARRAY = ["Speed", "Defuse","Ignite","45DegreeBoost","Strengthen"];
export const EFFECT_COLORS = ["#70faff", "#7fc947", "#d13030","#5757ff", "#ffe436"];
export const EFFECT_DURATIONS = [120, 1, 600, 30, 300];

export const EXPLOSION_BASE_RADIUS = 150;
export const EXPLOSION_STACKABLE_RADIUS = 75;
export const EXPLOSION_ERROR_MARGIN = Math.sqrt( (TARGET_WIDTH * TARGET_WIDTH) + (TARGET_HEIGHT * TARGET_HEIGHT) ) / 2;
export const EXPLOSION_COLOR1 = "#FFFFFF";
export const EXPLOSION_COLOR2 = "#FFFFFF";
export const EXPLOSION_BREAK = 120;

export const WINNING_MESSAGE_1 = "congratulations player ";
export const WINNING_MESSAGE_2 = "you won";
export const WINNING_MESSAGE_2_VARIANT = "you utterly humiliated your opponent";
export const WINNING_MESSAGE_3 = "enter";
export const GOLD_COLOR_1 = "#c7af3a";
export const GOLD_COLOR_2 = "#e8d15f";