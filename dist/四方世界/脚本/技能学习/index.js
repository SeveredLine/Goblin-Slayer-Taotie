var __webpack_modules__ = {
  "./src/四方世界/脚本/技能学习/index.ts"(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
    eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);\n\n// ST_API functions are accessed via (window as any) currently.\nconst $ = window.$;\nconst BTN_NAME = '技能学习';\nconst CTX = { type: 'message', message_id: 'latest' };\nconst getSkillPoints = (vars) => {\n    const v = lodash__WEBPACK_IMPORTED_MODULE_0___default().get(vars, 'stat_data.主角.技能点', lodash__WEBPACK_IMPORTED_MODULE_0___default().get(vars, '主角.技能点', 0));\n    return Number(v) || 0;\n};\nconst getPointsPath = (vars) => {\n    if (lodash__WEBPACK_IMPORTED_MODULE_0___default().has(vars, 'stat_data.主角.技能点'))\n        return 'stat_data.主角.技能点';\n    if (lodash__WEBPACK_IMPORTED_MODULE_0___default().has(vars, '主角.技能点'))\n        return '主角.技能点';\n    return 'stat_data.主角.技能点';\n};\n$(() => {\n    (async () => {\n        try {\n            await window.triggerSlash(`/buttons ${BTN_NAME}`);\n        }\n        catch (err) {\n            console.error('[技能学习] 显示按钮失败', err);\n        }\n    })();\n    window.eventOn(window.getButtonEvent(BTN_NAME), async () => {\n        try {\n            const vars = window.getVariables(CTX);\n            const points = getSkillPoints(vars);\n            const pointsPath = getPointsPath(vars);\n            if (points <= 0) {\n                window.toastr.warning('技能点不足，无法学习新技能');\n                return;\n            }\n            const skillName = window.prompt('输入要学习的技能名（键名）：', '');\n            if (!skillName)\n                return;\n            const skillPath = `stat_data.主角.技能列表.${skillName}`;\n            const existed = lodash__WEBPACK_IMPORTED_MODULE_0___default().get(vars, skillPath);\n            if (existed) {\n                window.toastr.info(`技能「${skillName}」已存在，未消耗技能点`);\n                return;\n            }\n            const desc = window.prompt('输入技能描述（可留空）：', '') || '';\n            const cost = window.prompt('输入技能消耗（可留空）：', '无') || '无';\n            const newSkill = {\n                type: '主动',\n                level: '初级',\n                熟练度: 0,\n                efficiency: 1,\n                description: desc,\n                cost,\n            };\n            window.setVariable(pointsPath, Math.max(0, points - 1), CTX);\n            window.setVariable(skillPath, newSkill, CTX);\n            window.toastr.success(`已学习技能「${skillName}」，消耗 1 技能点`);\n        }\n        catch (err) {\n            console.error('[技能学习] 学习失败', err);\n            window.toastr.error('学习技能失败，请查看控制台');\n        }\n    });\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMv5Zub5pa55LiW55WML+iEmuacrC/mioDog73lrabkuaAvaW5kZXgudHMiLCJtYXBwaW5ncyI6Ijs7O0FBQXVCO0FBRXZCLCtEQUErRDtBQUMvRCxNQUFNLENBQUMsR0FBSSxNQUFjLENBQUMsQ0FBQyxDQUFDO0FBRTVCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUN4QixNQUFNLEdBQUcsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBVyxDQUFDO0FBRS9ELE1BQU0sY0FBYyxHQUFHLENBQUMsSUFBUyxFQUFFLEVBQUU7SUFDbkMsTUFBTSxDQUFDLEdBQUcsaURBQUssQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsaURBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEUsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hCLENBQUMsQ0FBQztBQUVGLE1BQU0sYUFBYSxHQUFHLENBQUMsSUFBUyxFQUFFLEVBQUU7SUFDbEMsSUFBSSxpREFBSyxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FBQztRQUFFLE9BQU8sa0JBQWtCLENBQUM7SUFDL0QsSUFBSSxpREFBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7UUFBRSxPQUFPLFFBQVEsQ0FBQztJQUMzQyxPQUFPLGtCQUFrQixDQUFDO0FBQzVCLENBQUMsQ0FBQztBQUVGLENBQUMsQ0FBQyxHQUFHLEVBQUU7SUFDTCxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ1YsSUFBSSxDQUFDO1lBQ0gsTUFBTyxNQUFjLENBQUMsWUFBWSxDQUFDLFlBQVksUUFBUSxFQUFFLENBQUMsQ0FBQztRQUM3RCxDQUFDO1FBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7SUFDSCxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRUosTUFBYyxDQUFDLE9BQU8sQ0FBRSxNQUFjLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzNFLElBQUksQ0FBQztZQUNILE1BQU0sSUFBSSxHQUFJLE1BQWMsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0MsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QyxJQUFJLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDZixNQUFjLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDaEQsT0FBTztZQUNULENBQUM7WUFFRCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxTQUFTO2dCQUFFLE9BQU87WUFFdkIsTUFBTSxTQUFTLEdBQUcscUJBQXFCLFNBQVMsRUFBRSxDQUFDO1lBQ25ELE1BQU0sT0FBTyxHQUFHLGlEQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksT0FBTyxFQUFFLENBQUM7Z0JBQ1gsTUFBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxTQUFTLGFBQWEsQ0FBQyxDQUFDO2dCQUMxRCxPQUFPO1lBQ1QsQ0FBQztZQUVELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNyRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUM7WUFFdkQsTUFBTSxRQUFRLEdBQUc7Z0JBQ2YsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsR0FBRyxFQUFFLENBQUM7Z0JBQ04sVUFBVSxFQUFFLENBQUM7Z0JBQ2IsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLElBQUk7YUFDTCxDQUFDO1lBRUQsTUFBYyxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3JFLE1BQWMsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUVyRCxNQUFjLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLFNBQVMsWUFBWSxDQUFDLENBQUM7UUFDakUsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNqQyxNQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNoRCxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsic3JjOi8vdGF2ZXJuX2hlbHBlcl90ZW1wbGF0ZS9zcmMv5Zub5pa55LiW55WML+iEmuacrC/mioDog73lrabkuaAvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbi8vIFNUX0FQSSBmdW5jdGlvbnMgYXJlIGFjY2Vzc2VkIHZpYSAod2luZG93IGFzIGFueSkgY3VycmVudGx5LlxyXG5jb25zdCAkID0gKHdpbmRvdyBhcyBhbnkpLiQ7XHJcblxyXG5jb25zdCBCVE5fTkFNRSA9ICfmioDog73lrabkuaAnO1xyXG5jb25zdCBDVFggPSB7IHR5cGU6ICdtZXNzYWdlJywgbWVzc2FnZV9pZDogJ2xhdGVzdCcgfSBhcyBjb25zdDtcclxuXHJcbmNvbnN0IGdldFNraWxsUG9pbnRzID0gKHZhcnM6IGFueSkgPT4ge1xyXG4gIGNvbnN0IHYgPSBfLmdldCh2YXJzLCAnc3RhdF9kYXRhLuS4u+inki7mioDog73ngrknLCBfLmdldCh2YXJzLCAn5Li76KeSLuaKgOiDveeCuScsIDApKTtcclxuICByZXR1cm4gTnVtYmVyKHYpIHx8IDA7XHJcbn07XHJcblxyXG5jb25zdCBnZXRQb2ludHNQYXRoID0gKHZhcnM6IGFueSkgPT4ge1xyXG4gIGlmIChfLmhhcyh2YXJzLCAnc3RhdF9kYXRhLuS4u+inki7mioDog73ngrknKSkgcmV0dXJuICdzdGF0X2RhdGEu5Li76KeSLuaKgOiDveeCuSc7XHJcbiAgaWYgKF8uaGFzKHZhcnMsICfkuLvop5Iu5oqA6IO954K5JykpIHJldHVybiAn5Li76KeSLuaKgOiDveeCuSc7XHJcbiAgcmV0dXJuICdzdGF0X2RhdGEu5Li76KeSLuaKgOiDveeCuSc7XHJcbn07XHJcblxyXG4kKCgpID0+IHtcclxuICAoYXN5bmMgKCkgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgYXdhaXQgKHdpbmRvdyBhcyBhbnkpLnRyaWdnZXJTbGFzaChgL2J1dHRvbnMgJHtCVE5fTkFNRX1gKTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdb5oqA6IO95a2m5LmgXSDmmL7npLrmjInpkq7lpLHotKUnLCBlcnIpO1xyXG4gICAgfVxyXG4gIH0pKCk7XHJcblxyXG4gICh3aW5kb3cgYXMgYW55KS5ldmVudE9uKCh3aW5kb3cgYXMgYW55KS5nZXRCdXR0b25FdmVudChCVE5fTkFNRSksIGFzeW5jICgpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHZhcnMgPSAod2luZG93IGFzIGFueSkuZ2V0VmFyaWFibGVzKENUWCk7XHJcbiAgICAgIGNvbnN0IHBvaW50cyA9IGdldFNraWxsUG9pbnRzKHZhcnMpO1xyXG4gICAgICBjb25zdCBwb2ludHNQYXRoID0gZ2V0UG9pbnRzUGF0aCh2YXJzKTtcclxuICAgICAgaWYgKHBvaW50cyA8PSAwKSB7XHJcbiAgICAgICAgKHdpbmRvdyBhcyBhbnkpLnRvYXN0ci53YXJuaW5nKCfmioDog73ngrnkuI3otrPvvIzml6Dms5XlrabkuaDmlrDmioDog70nKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHNraWxsTmFtZSA9IHdpbmRvdy5wcm9tcHQoJ+i+k+WFpeimgeWtpuS5oOeahOaKgOiDveWQje+8iOmUruWQje+8ie+8micsICcnKTtcclxuICAgICAgaWYgKCFza2lsbE5hbWUpIHJldHVybjtcclxuXHJcbiAgICAgIGNvbnN0IHNraWxsUGF0aCA9IGBzdGF0X2RhdGEu5Li76KeSLuaKgOiDveWIl+ihqC4ke3NraWxsTmFtZX1gO1xyXG4gICAgICBjb25zdCBleGlzdGVkID0gXy5nZXQodmFycywgc2tpbGxQYXRoKTtcclxuICAgICAgaWYgKGV4aXN0ZWQpIHtcclxuICAgICAgICAod2luZG93IGFzIGFueSkudG9hc3RyLmluZm8oYOaKgOiDveOAjCR7c2tpbGxOYW1lfeOAjeW3suWtmOWcqO+8jOacqua2iOiAl+aKgOiDveeCuWApO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZGVzYyA9IHdpbmRvdy5wcm9tcHQoJ+i+k+WFpeaKgOiDveaPj+i/sO+8iOWPr+eVmeepuu+8ie+8micsICcnKSB8fCAnJztcclxuICAgICAgY29uc3QgY29zdCA9IHdpbmRvdy5wcm9tcHQoJ+i+k+WFpeaKgOiDvea2iOiAl++8iOWPr+eVmeepuu+8ie+8micsICfml6AnKSB8fCAn5pegJztcclxuXHJcbiAgICAgIGNvbnN0IG5ld1NraWxsID0ge1xyXG4gICAgICAgIHR5cGU6ICfkuLvliqgnLFxyXG4gICAgICAgIGxldmVsOiAn5Yid57qnJyxcclxuICAgICAgICDnhp/nu4PluqY6IDAsXHJcbiAgICAgICAgZWZmaWNpZW5jeTogMSxcclxuICAgICAgICBkZXNjcmlwdGlvbjogZGVzYyxcclxuICAgICAgICBjb3N0LFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgKHdpbmRvdyBhcyBhbnkpLnNldFZhcmlhYmxlKHBvaW50c1BhdGgsIE1hdGgubWF4KDAsIHBvaW50cyAtIDEpLCBDVFgpO1xyXG4gICAgICAod2luZG93IGFzIGFueSkuc2V0VmFyaWFibGUoc2tpbGxQYXRoLCBuZXdTa2lsbCwgQ1RYKTtcclxuXHJcbiAgICAgICh3aW5kb3cgYXMgYW55KS50b2FzdHIuc3VjY2Vzcyhg5bey5a2m5Lmg5oqA6IO944CMJHtza2lsbE5hbWV944CN77yM5raI6ICXIDEg5oqA6IO954K5YCk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignW+aKgOiDveWtpuS5oF0g5a2m5Lmg5aSx6LSlJywgZXJyKTtcclxuICAgICAgKHdpbmRvdyBhcyBhbnkpLnRvYXN0ci5lcnJvcign5a2m5Lmg5oqA6IO95aSx6LSl77yM6K+35p+l55yL5o6n5Yi25Y+wJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuZXhwb3J0IHsgfTtcclxuXHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/四方世界/脚本/技能学习/index.ts\n\n}");
  },
  lodash(module) {
    module.exports = _;
  }
};

var __webpack_module_cache__ = {};

function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  if (__webpack_modules__[moduleId] === undefined) {
    var e = new Error("Cannot find module '" + moduleId + "'");
    e.code = "MODULE_NOT_FOUND";
    throw e;
  }
  var module = __webpack_module_cache__[moduleId] = {
    exports: {}
  };
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  return module.exports;
}

(() => {
  __webpack_require__.n = module => {
    var getter = module && module.__esModule ? () => module["default"] : () => module;
    __webpack_require__.d(getter, {
      a: getter
    });
    return getter;
  };
})();

(() => {
  __webpack_require__.d = (exports, definition) => {
    for (var key in definition) {
      if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: definition[key]
        });
      }
    }
  };
})();

(() => {
  __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
})();

(() => {
  __webpack_require__.r = exports => {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, {
        value: "Module"
      });
    }
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
  };
})();

var __webpack_exports__ = __webpack_require__("./src/四方世界/脚本/技能学习/index.ts");