(function () {
    'use strict';

    angular
        .module('app')
        .controller('Work.IndexController', Controller);

    function Controller(WorkService, $window, StudentService, FlashService) {
        var vm = this;

        vm.works = null;
        vm.student = null;

        initController();

        function initController() {
            // get current student
            StudentService.GetCurrent().then(function (student) {
                vm.student = student;
            });
            WorkService.GetAllByStudentId(vm.student).then(function (works) {
                vm.works = works;
            });
        }

    }

})();