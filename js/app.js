Vue.component('top-header', {
	template: '<div id="header-wrap"><div class="header-contain"><ul class="header-contents"><li></li><li></li></ul></div></div>'
})
var vm = new Vue({
	el: '#app',
	data() {
		return {
			showMainPopup: false,
			showResultPopup01: false,
			showResultPopup02: false,
			showResultAlert: false,
			testIndex: 0,
			testQustions: ["최근에 일어난 일을<br />기억하는 것이 어렵나요?", "며칠 전에 나눈 대화 내용을 <br /> 기억하기 어렵나요?", "며칠 전에 한 약속을<br />기억하기 어렵나요?", "친한 사람의 이름을<br />기억하기 어렵나요?", "물건 둔 곳을<br />기억하기 어렵나요?", "이전에 비해<br />물건을 자주 잃어버리나요?", "집 근처에서<br />길을 잃은 적이 있나요?", "가게에서 2-3가지 물건을<br />사려고 할 때 <br /> 물건 이름을 기억하기 어렵나요?", "가스불이나 전깃불 끄는 것을<br />기억하기 어렵나요?", "본인이나 자녀의 전화번호를<br />기억하기 어렵나요?", ],
			testQustionsSelected: [
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
			],
			copyURL: "http://naver.com"
		}
	},
	created() {
    this.initKakao();
  },
	mounted() {
		if (document.querySelector(".test-page") && this.testIndex == 0) {
			if (location.search.indexOf("type=back") >= 0) {
				this.testIndex = 9
				this.testQustionsSelected = JSON.parse(localStorage.getItem("testQustionsSelected"))
			} else {
				console.log("testQustionsSelected 초기화")
				localStorage.setItem("testQustionsSelected", JSON.stringify([null, null, null, null, null, null, null, null, null, null]))
			}
		}

		if( this.$refs.testStart ){
			setInterval(() => {
				this.$refs.testStart.classList.toggle('on');
			}, 500);
		}

	},
	watch: {
		testIndex(value) {
			if (value == 10) {
				var count = this.testQustionsSelected.reduce((result, value) => {
					return value == true ? result + 1 : result;
				}, 0)
				window.location.href = "./result.html?c=".concat(count)
			}
		},
		testQustionsSelected(value) {
			localStorage.setItem("testQustionsSelected", JSON.stringify(value))
		}
	},
	computed: {
		trueCount() {
			var _parammap = {};
			document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
				function decode(s) {
					return decodeURIComponent(s.split("+").join(" "));
				}
				_parammap[decode(arguments[1])] = decode(arguments[2]);
			});
			var intCount = parseInt(_parammap["c"])
			intCount = isNaN(intCount) ? 0 : intCount * 10
			//return intCount >= 10 ? intCount : "0".concat(intCount);
			return intCount
		},
		resultText() {
			return parseInt(this.trueCount) >= 5 ? "있습" : "없습"
		}
	},
	methods: {
		onClickStart() {
			window.location.href = "./test.html"
		},
		/* 메인 팝업 */
		onClickMainPopupShow() {
			this.showMainPopup = true;
		},
		onClickMainPopupClose() {
			this.showMainPopup = false;
		},
		/* 결과화면 팝업 */
		onClickResultPopup01Show() {
			this.showResultPopup01 = true;
		},
		onClickResultPopup01Close() {
			this.showResultPopup01 = false;
			this.showResultPopup02 = false;
		},
		onClickResultPopup02Show() {
			this.showResultPopup02 = true;
		},
		onClickResultPopup02Close() {
			this.showResultPopup01 = false;
			this.showResultPopup02 = false;
		},
		/* URL 복사 얼럿 */
		onClickShowAlert() {
			this.showResultAlert = true
		},
		onClickCloseAlert() {
			this.showResultAlert = false
		},
		/* TEST 화면 - 문제 답변 선택 */
		selectedValue(qustionIndex, selectValue) {
			var that = this;
			setTimeout(() => {
				that.testIndex = that.testIndex + 1;
			}, 300)
			this.testQustionsSelected[qustionIndex] = selectValue
			this.testQustionsSelected = this.testQustionsSelected.slice()
		},
		onClickPrev() {
			if (this.testIndex == 0) {
				window.location.href = "./index.html"
				return
			}
			this.testIndex = this.testIndex - 1;
		},
		onClickGotoHome() {
			window.location.href = "./index.html"
		},
		onClickResultBack() {
			window.location.href = "./test.html?type=back"
		},
		/*
		onClickUrlCopy() {
			var clipboard = new ClipboardJS('.url-copy');
			var that = this;
			clipboard.on('success', function (e) {
				console.info('Action:', e.action);
				console.info('Text:', e.text);
				console.info('Trigger:', e.trigger);
				e.clearSelection();
				that.onClickShowAlert();
			});
			clipboard.on('error', function (e) {
				console.error('Action:', e.action);
				console.error('Trigger:', e.trigger);
			});
		},
		*/
		onClickCall() {
			location.href = "tel:15664990"
		},
		initKakao(){
      // SDK를 초기화 합니다. 사용할 앱의 JavaScript 키를 설정해 주세요.
      Kakao.init('5280ace8240daa19ce8335c0f1ad1aef');
      // SDK 초기화 여부를 판단합니다.
      console.log(Kakao.isInitialized());
    },
		onClickKakao(){
      Kakao.Link.sendCustom({
        templateId: 61495,
        templateArgs: {
          'title': '누구에게나 찾아올 수 있는 치매',
          'description': '치매 테스트를 통해 나는 치매로부터 얼마나 자유로운지 확인해보세요!'     
        }
      });
    },
		onClickUrlCopy() {
      var text = "치매테스트를 통해 나는 치매로부터 얼마나 자유로운지 확인해보세요!" + encodeURIComponent("\n" + 'https://kei5693.github.io/lina-alzheimer/index.html');
      location.href = 'sms:' + (this.checkMobile() == 'ios' ? '&' : '?') + 'body='+ text;
    },
    checkMobile(){
      var varUA = navigator.userAgent.toLowerCase();
      if ( varUA.indexOf('android') > -1) {
        //안드로이드
        return "android";
      } else if ( varUA.indexOf("iphone") > -1 || varUA.indexOf("ipad") > -1 || varUA.indexOf("ipod") > -1 ) {
        //IOS
        return "ios";
      } else {
        //아이폰, 안드로이드 외
        return "other";
      }
    }
	},
});