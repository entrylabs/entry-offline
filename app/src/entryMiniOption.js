(function() {
    var option = {};
    option.allBlocks = function() {
        return [{
            category: "start",
            blocks: [
                "when_run_button_click",
                "when_some_key_pressed",
                "mouse_clicked",
                "mouse_click_cancled",
                "when_object_click",
                "when_message_cast",
                "message_cast",
            ]
        }, {
            category: "flow",
            blocks: [
                "wait_second",
                "repeat_basic",
                "repeat_inf",
                "repeat_while_true",
                "stop_repeat",
                "_if",
                "if_else",
                "wait_until_true",
            ]
        }, {
            category: "moving",
            blocks: [
                "move_direction",
                "bounce_wall",
                "move_x",
                "move_y",
                "locate_y",
                "locate_xy",
                "locate_xy_time",
                "locate",
                "locate_object_time",
                "rotate_relative",
                "direction_relative",
                "rotate_absolute",
                "direction_absolute",
                "see_angle_object",
            ]
        }, {
            category: "looks",
            blocks: [
                "show",
                "hide",
                "dialog_time",
                "change_to_some_shape",
                "change_to_next_shape",
                "add_effect_amount",
                "change_effect_amount",
                "erase_all_effects",
                "change_scale_size",
                "set_scale_size",
            ]
        }, {
            category: "brush",
            blocks: [
                "brush_stamp",
                "start_drawing",
                "stop_drawing",
                "set_color",
                "change_thickness",
                "set_thickness",
                "brush_erase_all"
            ]
        }, {
            category: "text",
            blocks: [
                "text_write",
                "text_append",
                "text_prepend",
                "text_flush"
            ]
        }, {
            category: "sound",
            blocks: [
                "sound_something_with_block",
                "sound_something_wait_with_block",
                "sound_volume_change",
                "sound_volume_set",
            ]
        }, {
            category: "judgement",
            blocks: [
                "is_clicked",
                "is_press_some_key",
                "reach_something",
                "boolean_basic_operator",
            ]
        }, {
            category: "calc",
            blocks: [
                "calc_basic",
                "calc_rand",
                "coordinate_object",
                "quotient_and_mod",
                "get_project_timer_value",
                "choose_project_timer_action",
                "set_visible_project_timer",
                "length_of_string",
                "combine_something",
                "char_at",
                "substring",
                "replace_string",
            ]
        }, {
            category: "variable",
            blocks: [
                "variableAddButton",
                "ask_and_wait",
                "get_canvas_input_value",
                "set_visible_answer",
                "get_variable",
                "change_variable",
                "set_variable",
                "show_variable",
                "hide_variable",
            ]
        }, {
            category: "hw_motor",
            visible: false,
            blocks: [
                "practical_course_move_for_secs",
                "practical_course_move_for",
                "practical_course_stop_for",
                "practical_course_set_servo2",
            ]
        }, {
            category: "hw_melody",
            visible: false,
            blocks: [
                "practical_course_melody_note_for",
            ]
        }, {
            category: "hw_sensor",
            visible: false,
            blocks: [
                "practical_course_touch_value",
                "practical_course_touch_value_boolean",
                "practical_course_light_value",
                "practical_course_light_value_boolean",
                "practical_course_sound_value",
                "practical_course_sound_value_boolean",
                "practical_course_irs_value",
                "practical_course_irs_value_boolean",
            ]
        }, {
            category: "hw_led",
            visible: false,
            blocks: [
                "practical_course_diode_secs_toggle",
                "practical_course_diode_toggle",
                "practical_course_diode_inout_toggle",
                "practical_course_diode_set_output",
                "practical_course_diode_input_value"
            ]
        }, {
            category: "hw_robot",
            blocks: [
                "arduino_download_connector",
                "download_guide",
                "arduino_download_source",
                "arduino_connected",
                "arduino_reconnect",
            ]
        }];
    }

    option.initOptions = {
        listEnable: false,
        functionEnable: false,
        sceneEditable: false,
    }

    option.hwCategoryList = ['hw_motor', 'hw_melody', 'hw_sensor', 'hw_led'];

    if (typeof define === 'function' && define.amd) {
        define(function() {
            return option;
        });
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        module.exports = option;
    } else {
        window.entryMiniOption = option;
    }
})();
