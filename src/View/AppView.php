<?php

namespace App\View;

use BootstrapUI\View\UIViewTrait;
use Cake\View\View;

class AppView extends View
{
    use UIViewTrait;

    public function initialize()
    {
        if ($this->request->getParam('prefix') === 'owner') {
            $this->loadHelper('HtmlEx');
        }
        
        $this->initializeUI(['layout' => false]);
        
        $this->helpers['Flash'] = ['className' => 'Flash'];
        
        parent::initialize();
    }
}
