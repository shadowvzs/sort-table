<?php

namespace App\View\Helper;

use Cake\View\Helper;
use Cake\View\View;
use Cake\ORM\TableRegistry;

class HtmlExHelper extends Helper
{
    public $helpers = ['Html', 'Form'];

    public function order($direction = 'up')
    {
        return $this->Html->link(
            '<i class="fas fa-arrow-'.$direction.'"></i>',
            [],
            [
                'data-direction' => $direction,
                'escape' => false
            ]
        );
    }
}
